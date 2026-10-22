import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Send,
  Sparkles,
  Zap,
  Hand,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ImagePlus,
  ExternalLink,
  Maximize2,
  Minimize2,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  FileText,
  FileUp,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { selectCurrentToken, selectIsAuthenticated } from "@/store/slices/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://fields-and-waves-visualization-lab.onrender.com");

const CHATBOT_HIDDEN_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

const createChatThreadId = () =>
  window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);

type CourseTopicLink = {
  title: string;
  module: string;
  path: string;
  observedTopic?: string;
  reason?: string;
  confidence?: number | null;
};

type ChatMessage = {
  role: "user" | "bot";
  text: string;
  imageUrl?: string;
  topic?: CourseTopicLink;
  alternatives?: CourseTopicLink[];
  docTopics?: CourseTopicLink[];
};

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_PDF_SIZE = 15 * 1024 * 1024;

// Minimal shape for the Web Speech API (not in the default TS DOM lib).
type SpeechRecognitionResult = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResult) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const getSpeechRecognition = (): SpeechRecognitionLike | null => {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
};

const speechRecognitionSupported =
  typeof window !== "undefined" &&
  !!(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );

const speechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;

// Strip HTML tags so bot answers (which may contain links) read cleanly aloud.
const stripHtmlForSpeech = (html: string): string => {
  if (typeof document === "undefined") return html;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
};

// Higher-quality voices, in order of preference. Names vary by OS/browser;
// the network-backed "Google"/"Natural"/"Online" voices sound far better than
// the robotic local defaults.
const PREFERRED_VOICE_MATCHERS = [
  (n: string) => /google us english/i.test(n),
  (n: string) => /google uk english female/i.test(n),
  (n: string) => /(natural|online)/i.test(n),
  (n: string) => /samantha/i.test(n),
  (n: string) => /(ava|allison|serena|zoe|jenny|aria)/i.test(n),
  (n: string) => /google/i.test(n),
];

const pickBestEnglishVoice = (
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null => {
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = english.length ? english : voices;
  if (!pool.length) return null;
  for (const matches of PREFERRED_VOICE_MATCHERS) {
    const found = pool.find((v) => matches(v.name));
    if (found) return found;
  }
  // Prefer a US English voice, otherwise the first English one.
  return pool.find((v) => /en[-_]us/i.test(v.lang)) || pool[0];
};

export default function ChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.client);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 🚫 Hide chatbot completely on quiz page
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [activeDoc, setActiveDoc] = useState<{ name: string; topics: CourseTopicLink[] } | null>(null);
  const [isWaving, setIsWaving] = useState(false);
  const [peekState, setPeekState] = useState<"hidden" | "peeking" | "full">("peeking");
  const [waves, setWaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [chatThreadId, setChatThreadId] = useState(createChatThreadId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const waveIdRef = useRef(0);
  const wasHiddenRouteRef = useRef(false);
  const isHiddenRoute =
    location.pathname.includes("quiz") ||
    CHATBOT_HIDDEN_ROUTES.includes(location.pathname);

  // Session ID is tied to the logged-in user.
  const getChatSessionId = useCallback((): string => {
    return `user-${user?._id}-thread-${chatThreadId}`;
  }, [chatThreadId, user?._id]);

  const stopCameraStream = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
  }, []);

  const closeCamera = useCallback(() => {
    stopCameraStream();
    setCameraOpen(false);
    setCameraError("");
  }, [stopCameraStream]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    setSpeakingIndex(null);
  }, []);

  // Load the best available speech-synthesis voice (voices arrive asynchronously).
  useEffect(() => {
    if (!speechSynthesisSupported) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        voiceRef.current = pickBestEnglishVoice(voices);
      }
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Waving animation
  useEffect(() => {
    if (isOpen || !isVisible) return;
    const waveTimeout = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 1000);
    return () => clearTimeout(waveTimeout);
  }, [isOpen, isVisible]);

  useEffect(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];

    if (!user?._id) {
      setMessages([]);
      setInput("");
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setUploadError("");
      setActiveDoc(null);
      return;
    }

    setMessages([]);
    setInput("");
    setActiveDoc(null);
    setChatThreadId(createChatThreadId());
  }, [user?._id]);

  useEffect(() => () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    stopCameraStream();
    stopListening();
    stopSpeaking();
  }, [stopCameraStream, stopListening, stopSpeaking]);

  // Stop the camera / voice whenever the chat is closed/hidden.
  useEffect(() => {
    if (!isOpen || !isVisible) {
      closeCamera();
      stopListening();
      stopSpeaking();
    }
  }, [isOpen, isVisible, closeCamera, stopListening, stopSpeaking]);

  useEffect(() => {
    if (isHiddenRoute) {
      wasHiddenRouteRef.current = true;
      setIsOpen(false);
      setPeekState("peeking");
      return;
    }

    if (wasHiddenRouteRef.current) {
      setIsVisible(true);
      setPeekState("peeking");
      wasHiddenRouteRef.current = false;
    }
  }, [isHiddenRoute]);

  // Create wave ripple effect
  const createWave = (x: number, y: number) => {
    const newWave = { id: waveIdRef.current++, x, y };
    setWaves((prev) => [...prev, newWave]);
    setTimeout(() => {
      setWaves((prev) => prev.filter((w) => w.id !== newWave.id));
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > input.length) {
      const rect = e.target.getBoundingClientRect();
      createWave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  const acceptImageFile = (file: File) => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setUploadError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError("Please choose an image smaller than 8 MB.");
      return;
    }

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== selectedImagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.push(previewUrl);
    setSelectedImage(file);
    setSelectedImagePreview(previewUrl);
    setUploadError("");
  };

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    acceptImageFile(file);
  };

  const openCamera = async () => {
    if (!isAuthenticated) {
      handleSignIn();
      return;
    }
    setUploadError("");
    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("[ChatBot] camera error:", err);
      setCameraError("Couldn't access the camera. Please allow camera permission or upload a file instead.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError("Camera is still starting. Please wait a moment and try again.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError("Couldn't capture the photo. Please try again.");
        return;
      }
      const file = new File([blob], `fieldora-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      acceptImageFile(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  const toggleListening = () => {
    if (!isAuthenticated) {
      handleSignIn();
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    const recognition = getSpeechRecognition();
    if (!recognition) {
      setUploadError("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    stopSpeaking();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setUploadError("");
    setIsListening(true);
    recognition.start();
  };

  const speakMessage = (text: string, index: number) => {
    if (!speechSynthesisSupported) return;
    // Toggle off if this message is already being read.
    if (speakingIndex === index) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const spoken = stripHtmlForSpeech(text);
    if (!spoken) return;

    // Make sure we have the best voice (list may have populated late).
    if (!voiceRef.current) {
      voiceRef.current = pickBestEnglishVoice(window.speechSynthesis.getVoices());
    }

    const utterance = new SpeechSynthesisUtterance(spoken);
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current.lang;
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const removeSelectedImage = () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== selectedImagePreview);
    }
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setUploadError("");
  };

  const sendPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim() || loading) return;

    if (!isAuthenticated || !token || !user?._id) {
      setIsVisible(true);
      setIsOpen(true);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Please sign in to use Fieldora." },
      ]);
      return;
    }

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setAnalyzingImage(false);
    setLoading(true);

    const chatRect = document.querySelector(".wave-chat-window")?.getBoundingClientRect();
    if (chatRect) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createWave(chatRect.left + chatRect.width / 2, chatRect.top + chatRect.height / 2);
        }, i * 100);
      }
    }

    try {
      const sessionId = getChatSessionId();
      console.log(`[ChatBot] session=${sessionId} | query=${userMessage}`);

      const response = await fetch(`${API_BASE_URL}/api/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,   // ✅ Per-user session
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (error) {
      console.error("[ChatBot] fetch error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "🔧 Oops! I'm currently out of service. My electromagnetic field is being recharged! I'll be back online soon. Please try again in a bit! ⚡",
        },
      ]);
    }

    setLoading(false);
  }, [getChatSessionId, isAuthenticated, loading, token, user]);

  const findTopicFromImage = async () => {
    if (!selectedImage || loading) return;

    if (!isAuthenticated || !token || !user?._id) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Please sign in to search the course with an image." },
      ]);
      return;
    }

    const learnerNote = input.trim();
    const previewUrl = selectedImagePreview || undefined;
    const formData = new FormData();
    formData.append("image", selectedImage);
    if (learnerNote) formData.append("question", learnerNote);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: learnerNote || "Find the closest course topic for this image.",
        imageUrl: previewUrl,
      },
    ]);
    setInput("");
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setUploadError("");
    setAnalyzingImage(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/find-topic`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Image search failed (HTTP ${response.status}).`);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer || "I analyzed the image.",
          topic: data.topic || undefined,
          alternatives: Array.isArray(data.alternatives) ? data.alternatives : [],
        },
      ]);
    } catch (error) {
      console.error("[ChatBot] image topic search error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: error instanceof Error
            ? error.message
            : "I couldn't analyze that image right now. Please try again.",
        },
      ]);
    } finally {
      setAnalyzingImage(false);
      setLoading(false);
    }
  };

  const handlePdfSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Please choose a PDF file.");
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      setUploadError("Please choose a PDF smaller than 15 MB.");
      return;
    }
    if (!isAuthenticated || !token || !user?._id) {
      handleSignIn();
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("session_id", getChatSessionId());

    setMessages((prev) => [...prev, { role: "user", text: `📄 ${file.name}` }]);
    setUploadError("");
    setAnalyzingDoc(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/upload-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Upload failed (HTTP ${response.status}).`);
      }

      const topics: CourseTopicLink[] = Array.isArray(data.topics) ? data.topics : [];
      setActiveDoc({ name: data.name || file.name, topics });
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer || `I've read "${file.name}". Ask me anything about it.`,
          docTopics: topics,
        },
      ]);
    } catch (error) {
      console.error("[ChatBot] pdf upload error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: error instanceof Error ? error.message : "I couldn't read that PDF. Please try again.",
        },
      ]);
    } finally {
      setAnalyzingDoc(false);
      setLoading(false);
    }
  };

  const clearActiveDoc = () => {
    setActiveDoc(null);
  };

  const askDoc = async (prompt: string) => {
    if (!prompt.trim() || loading) return;
    if (!isAuthenticated || !token || !user?._id) {
      handleSignIn();
      return;
    }

    const question = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/ask-doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: question, session_id: getChatSessionId() }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 409) {
        // Document context expired on the server.
        setActiveDoc(null);
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Your document is no longer loaded. Please upload the PDF again." },
        ]);
        return;
      }
      if (!response.ok) {
        throw new Error(data.message || `Request failed (HTTP ${response.status}).`);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer || "I couldn't form an answer from the document.",
          topic: data.topic || undefined,
        },
      ]);
    } catch (error) {
      console.error("[ChatBot] ask-doc error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: error instanceof Error ? error.message : "I couldn't answer from the document right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (selectedImage) {
      await findTopicFromImage();
      return;
    }
    if (activeDoc) {
      await askDoc(input);
      return;
    }
    await sendPrompt(input);
  };

  useEffect(() => {
    const handleFieldoraPrompt = (event: Event) => {
      const { prompt, autoSend = true } =
        (event as CustomEvent<{ prompt?: string; autoSend?: boolean }>).detail || {};
      if (!prompt) return;

      setIsVisible(true);
      setIsOpen(true);
      setPeekState("full");

      if (autoSend) {
        void sendPrompt(prompt);
      } else {
        setInput(prompt);
      }
    };

    window.addEventListener("fieldora:prompt", handleFieldoraPrompt);
    return () => window.removeEventListener("fieldora:prompt", handleFieldoraPrompt);
  }, [sendPrompt]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setPeekState("full");
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createWave(window.innerWidth - 100, window.innerHeight / 2);
        }, i * 80);
      }
    } else {
      setIsOpen(false);
      setPeekState("peeking");
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (isOpen) {
      setIsOpen(false);
      setPeekState("peeking");
    }
  };

  const handleNewChat = () => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
    setMessages([]);
    setInput("");
    setLoading(false);
    setAnalyzingImage(false);
    setSelectedImage(null);
    setSelectedImagePreview(null);
    setUploadError("");
    setAnalyzingDoc(false);
    setActiveDoc(null);
    setChatThreadId(createChatThreadId());
  };

  const openCourseTopic = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setPeekState("peeking");
  };

  const handleSignIn = () => {
    navigate("/login");
    setIsOpen(false);
  };

  if (isHiddenRoute) {
    return null;
  }

  // ✅ Renders bot text safely — converts \n to <br> and keeps anchor links clickable
  const renderBotText = (text: string) => {
    const withBreaks = text.replace(/\n/g, "<br />");
    return (
      <div
        className="message-text"
        dangerouslySetInnerHTML={{ __html: withBreaks }}
      />
    );
  };

  return (
    <>
      {/* Wave Ripples */}
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="wave-ripple"
          style={{ left: wave.x, top: wave.y }}
        />
      ))}

      {/* Toggle Arrow Button (always visible) */}
      <button
        onClick={toggleVisibility}
        className={`toggle-arrow-button ${isVisible ? "visible" : "hidden-btn"}`}
        title={isVisible ? "Hide Fieldora" : "Show Fieldora"}
      >
        {isVisible ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Peeking Fieldora from the side */}
      {!isOpen && isVisible && (
        <div
          className={`peeking-container ${peekState}`}
          onClick={toggleChat}
        >
          <div className="peek-glow" />
          <div className="peek-character">
            <div className="field-effect">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="field-line"
                  style={{
                    transform: `rotate(${i * 45}deg)`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            <div className="character-body">
              <div className="logo-container">
                <img src="/fwvlab.png" alt="Fieldora" className="character-logo" />
              </div>
              <div className="character-eyes">
                <div className="eye left"><div className="pupil" /></div>
                <div className="eye right"><div className="pupil" /></div>
              </div>
              <div className={`waving-hand ${isWaving ? "active" : ""}`}>
                <Hand size={24} />
              </div>
              <Sparkles className="sparkle sparkle-1" size={16} />
              <Sparkles className="sparkle sparkle-2" size={12} />
              <Zap className="zap-effect" size={14} />
            </div>

            <div className="peek-bubble">
              <div className="bubble-text">
                {isAuthenticated
                  ? peekState === "peeking" ? "Hey there!" : "Click me!"
                  : "Sign in to chat"}
              </div>
            </div>
          </div>

          <div className="edge-indicator">
            <div className="indicator-line" />
            <div className="indicator-dot" />
            <div className="indicator-text">Fieldora</div>
          </div>
        </div>
      )}

      {/* Wave Visualizer Chat Window */}
      {isOpen && isVisible && (
        <div className={`wave-chat-window ${isExpanded ? "expanded" : ""}`}>
          <div className="wave-background">
            <svg className="wave-svg" viewBox="0 0 1200 320">
              <path className="wave-path wave-1" d="M0,160 Q300,100 600,160 T1200,160 L1200,320 L0,320 Z" />
              <path className="wave-path wave-2" d="M0,192 Q300,140 600,192 T1200,192 L1200,320 L0,320 Z" />
              <path className="wave-path wave-3" d="M0,224 Q300,180 600,224 T1200,224 L1200,320 L0,320 Z" />
            </svg>
          </div>

          {/* Header */}
          <div className="wave-header">
            <div className="header-content">
              <div className="header-avatar-container">
                <div className="header-avatar">
                  <img src="/fwvlab.png" alt="Fieldora" />
                </div>
                <div className="header-pulse-ring" />
              </div>
              <div>
                <div className="header-title">Fieldora</div>
                <div className="header-subtitle">
                  <span className="status-dot" />
                  {isAuthenticated ? "Your AI Field Guide" : "Sign in required"}
                </div>
              </div>
            </div>
            <div className="header-actions">
              {isAuthenticated && (
                <button onClick={handleNewChat} className="header-action-button" title="Start a new chat">
                  <RefreshCw size={17} />
                </button>
              )}
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="header-action-button"
                title={isExpanded ? "Shrink window" : "Expand window"}
              >
                {isExpanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>
              <button onClick={toggleChat} className="close-button">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 && isAuthenticated && (
              <div className="welcome-screen">
                <div className="welcome-wave-icon">∿</div>
                <div className="welcome-text">Ready to explore the electromagnetic universe?</div>
                <div className="welcome-subtitle">
                  Ask a question or upload a diagram to jump straight to its course topic.
                </div>
                <div className="quick-topics">
                  {["Maxwell's Equations", "Wave Propagation", "EM Spectrum"].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setInput(`Explain ${topic}`)}
                      className="topic-chip"
                    >
                      <Zap size={12} />
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length === 0 && !isAuthenticated && (
              <div className="welcome-screen">
                <div className="welcome-wave-icon">~</div>
                <div className="welcome-text">Sign in to chat with Fieldora</div>
                <div className="welcome-subtitle">Your account keeps the chatbot connected to your learning profile.</div>
                <button onClick={handleSignIn} className="signin-chat-button">
                  Sign in
                </button>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  {msg.role === "bot" && (
                    <div className="message-header">
                      <div className="message-avatar">
                        <img src="/fwvlab.png" alt="Fieldora" />
                      </div>
                      <span className="message-name">Fieldora</span>
                      {speechSynthesisSupported && msg.text && (
                        <button
                          type="button"
                          className={`speak-button ${speakingIndex === i ? "speaking" : ""}`}
                          onClick={() => speakMessage(msg.text, i)}
                          title={speakingIndex === i ? "Stop reading" : "Read aloud"}
                        >
                          {speakingIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      )}
                    </div>
                  )}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded course topic"
                      className="message-image"
                    />
                  )}
                  {/* ✅ Bot messages render HTML (for embedded links), user messages are plain text */}
                  {msg.role === "bot"
                    ? renderBotText(msg.text)
                    : <div className="message-text">{msg.text}</div>
                  }
                  {msg.topic && (
                    <div className="topic-match-card">
                      <div className="topic-match-module">{msg.topic.module}</div>
                      <div className="topic-match-title">{msg.topic.title}</div>
                      {msg.topic.reason && (
                        <div className="topic-match-reason">{msg.topic.reason}</div>
                      )}
                      {typeof msg.topic.confidence === "number" && (
                        <div className="topic-match-confidence">
                          Match confidence: {Math.round(msg.topic.confidence * 100)}%
                        </div>
                      )}
                      <button
                        type="button"
                        className="open-topic-button"
                        onClick={() => openCourseTopic(msg.topic!.path)}
                      >
                        Open topic <ExternalLink size={14} />
                      </button>
                      {msg.alternatives && msg.alternatives.length > 0 && (
                        <div className="alternative-topics">
                          <span>Other possible matches:</span>
                          {msg.alternatives.map((alternative) => (
                            <button
                              type="button"
                              key={alternative.path}
                              onClick={() => openCourseTopic(alternative.path)}
                            >
                              {alternative.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {msg.docTopics && msg.docTopics.length > 0 && (
                    <div className="topic-match-card">
                      <div className="topic-match-module">
                        <FileText size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />
                        This document covers
                      </div>
                      {msg.docTopics.map((t) => (
                        <button
                          type="button"
                          key={t.path}
                          className="doc-topic-row"
                          onClick={() => openCourseTopic(t.path)}
                          title={`Open ${t.title}`}
                        >
                          <span className="doc-topic-title">{t.title}</span>
                          <ExternalLink size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.role === "bot" && (
                    <svg className="message-wave" viewBox="0 0 100 10">
                      <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-wrapper bot">
                <div className="message-bubble bot loading-message">
                  <div className="message-header">
                    <div className="message-avatar pulsing">
                      <img src="/fwvlab.png" alt="Fieldora" />
                    </div>
                    <span className="message-name">Fieldora</span>
                  </div>
                  <div className="loading-dots">
                    <div className="electromagnetic-pulse">
                      <span className="pulse-dot" />
                      <span className="pulse-dot" />
                      <span className="pulse-dot" />
                    </div>
                    <span className="loading-text">
                      {analyzingImage
                        ? "Reading your image..."
                        : analyzingDoc
                        ? "Reading your document..."
                        : activeDoc
                        ? "Searching your document..."
                        : "Processing waves..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="input-container">
            <div className="input-wave-decoration">
              <svg viewBox="0 0 400 40">
                <path
                  className="input-wave-path"
                  d="M0,20 Q100,10 200,20 T400,20"
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {cameraOpen && (
              <div className="camera-panel">
                <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
                {cameraError && <div className="camera-error">{cameraError}</div>}
                <div className="camera-controls">
                  <button type="button" className="camera-capture-button" onClick={capturePhoto} disabled={!!cameraError}>
                    <Camera size={16} /> Capture
                  </button>
                  <button type="button" className="camera-cancel-button" onClick={closeCamera}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {selectedImagePreview && selectedImage && (
              <div className="selected-image-preview">
                <img src={selectedImagePreview} alt="Selected upload" />
                <div className="selected-image-details">
                  <strong>{selectedImage.name}</strong>
                  <span>Fieldora will match this to the course.</span>
                </div>
                <button type="button" onClick={removeSelectedImage} title="Remove image">
                  <X size={15} />
                </button>
              </div>
            )}
            {activeDoc && (
              <div className="active-doc-chip">
                <FileText size={15} />
                <div className="active-doc-details">
                  <strong>{activeDoc.name}</strong>
                  <span>Answering from your document</span>
                </div>
                <button type="button" onClick={clearActiveDoc} title="Stop using this document">
                  <X size={15} />
                </button>
              </div>
            )}
            {uploadError && <div className="upload-error">{uploadError}</div>}
            <div className="input-wrapper">
              <input
                ref={fileInputRef}
                type="file"
                className="image-file-input"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelected}
              />
              <input
                ref={pdfInputRef}
                type="file"
                className="image-file-input"
                accept="application/pdf"
                onChange={handlePdfSelected}
              />
              <button
                type="button"
                className="attach-image-button"
                onClick={() => isAuthenticated ? fileInputRef.current?.click() : handleSignIn()}
                disabled={loading}
                title={isAuthenticated ? "Upload an image to find its course topic" : "Sign in to upload an image"}
              >
                <ImagePlus size={18} />
              </button>
              <button
                type="button"
                className="attach-image-button"
                onClick={openCamera}
                disabled={loading}
                title={isAuthenticated ? "Take a photo to find its course topic" : "Sign in to use the camera"}
              >
                <Camera size={18} />
              </button>
              <button
                type="button"
                className="attach-image-button"
                onClick={() => isAuthenticated ? pdfInputRef.current?.click() : handleSignIn()}
                disabled={loading}
                title={isAuthenticated ? "Upload a PDF to ask questions about it" : "Sign in to upload a PDF"}
              >
                <FileUp size={18} />
              </button>
              {speechRecognitionSupported && (
                <button
                  type="button"
                  className={`attach-image-button mic-button ${isListening ? "listening" : ""}`}
                  onClick={toggleListening}
                  disabled={loading}
                  title={
                    !isAuthenticated
                      ? "Sign in to use voice input"
                      : isListening
                      ? "Stop listening"
                      : "Speak your question"
                  }
                >
                  <Mic size={18} />
                </button>
              )}
              <textarea
                className="wave-input"
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={
                  selectedImage
                    ? "Add a note (optional)..."
                    : activeDoc
                    ? "Ask about your document..."
                    : "Send a wave of curiosity..."
                }
                disabled={!isAuthenticated}
              />
              <button
                onClick={isAuthenticated ? sendMessage : handleSignIn}
                disabled={isAuthenticated && ((!input.trim() && !selectedImage) || loading)}
                className="send-button"
                title={isAuthenticated ? "Send message" : "Sign in to use Fieldora"}
              >
                <Send size={18} />
                <span className="button-wave" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Toggle Arrow Button */
        .toggle-arrow-button {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #ec4899, #a855f7);
          border: none;
          color: white;
          width: 36px;
          height: 60px;
          border-radius: 20px 0 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9998;
          box-shadow: -4px 0 15px rgba(168, 85, 247, 0.3);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .toggle-arrow-button:hover {
          transform: translateY(-50%) translateX(-5px);
          box-shadow: -8px 0 25px rgba(168, 85, 247, 0.5);
        }

        .toggle-arrow-button.visible {
          right: 190px;
        }

        .toggle-arrow-button.hidden-btn {
          right: 0;
          animation: arrow-pulse 2s ease-in-out infinite;
        }

        @keyframes arrow-pulse {
          0%, 100% {
            transform: translateY(-50%) translateX(0);
            box-shadow: -4px 0 15px rgba(168, 85, 247, 0.3);
          }
          50% {
            transform: translateY(-50%) translateX(-8px);
            box-shadow: -8px 0 25px rgba(168, 85, 247, 0.6);
          }
        }

        /* Wave Ripple Effect */
        .wave-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #a855f7;
          pointer-events: none;
          z-index: 9998;
          animation: ripple-expand 1s ease-out forwards;
        }

        @keyframes ripple-expand {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(20); }
        }

        /* Peeking Container */
        .peeking-container {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          cursor: pointer;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .peeking-container.hidden {
          transform: translateY(-50%) translateX(calc(100% - 30px));
        }

        .peeking-container.peeking {
          transform: translateY(-50%) translateX(0);
        }

        .peeking-container.full {
          transform: translateY(-50%) translateX(120%);
        }

        .peeking-container:hover {
          transform: translateY(-50%) translateX(-10px) !important;
        }

        .peek-glow {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%);
          filter: blur(40px);
          pointer-events: none;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateY(-50%) scale(1.2); }
        }

        .peek-character {
          position: relative;
          width: 200px;
          height: 280px;
        }

        .field-effect {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 120px;
          height: 120px;
          pointer-events: none;
        }

        .field-line {
          position: absolute;
          width: 100%;
          height: 2px;
          top: 50%;
          left: 50%;
          transform-origin: 0% 50%;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
          animation: field-pulse 2s ease-in-out infinite;
        }

        @keyframes field-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .character-body {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 160px;
          height: 220px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-radius: 100px 0 0 100px;
          box-shadow: -10px 0 40px rgba(168, 85, 247, 0.3), inset 5px 0 20px rgba(168, 85, 247, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          animation: peek-bounce 2s ease-in-out infinite;
        }

        @keyframes peek-bounce {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(-55%); }
        }

        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
          border-radius: 50%;
          padding: 4px;
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
          animation: logo-spin 10s linear infinite;
        }

        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .character-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
          border-radius: 50%;
          padding: 10px;
        }

        .character-eyes {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }

        .eye {
          width: 12px;
          height: 16px;
          background: #1f2937;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          position: relative;
          animation: blink 4s ease-in-out infinite;
        }

        .pupil {
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 3px;
          animation: look-around 3s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }

        @keyframes look-around {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .waving-hand {
          position: absolute;
          left: -30px;
          top: 40%;
          color: #fbbf24;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .waving-hand.active {
          opacity: 1;
          animation: wave-hand 0.6s ease-in-out infinite;
        }

        @keyframes wave-hand {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }

        .sparkle {
          position: absolute;
          color: #fbbf24;
          animation: sparkle-float 2s ease-in-out infinite;
        }

        .sparkle-1 { top: 20px; right: 10px; }
        .sparkle-2 { bottom: 30px; right: 15px; animation-delay: 1s; }

        @keyframes sparkle-float {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: translateY(-10px) scale(1.2) rotate(180deg); }
        }

        .zap-effect {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: #60a5fa;
          animation: zap-pulse 1.5s ease-in-out infinite;
        }

        @keyframes zap-pulse {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .peek-bubble {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 10px 18px;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          animation: bubble-float-bottom 2s ease-in-out infinite;
          z-index: 1;
        }

        .peek-bubble::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid white;
        }

        @keyframes bubble-float-bottom {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-5px); }
        }

        .bubble-text {
          font-size: 14px;
          font-weight: 600;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          white-space: nowrap;
        }

        .edge-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1));
          border-radius: 20px 0 0 20px;
        }

        .indicator-line {
          width: 3px;
          height: 30px;
          background: linear-gradient(to bottom, #ec4899, #a855f7);
          border-radius: 2px;
          animation: indicator-pulse 2s ease-in-out infinite;
        }

        @keyframes indicator-pulse {
          0%, 100% { opacity: 0.5; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        .indicator-dot {
          width: 10px;
          height: 10px;
          background: #a855f7;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
          animation: dot-pulse 2s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .indicator-text {
          writing-mode: vertical-rl;
          font-size: 11px;
          font-weight: 600;
          color: #a855f7;
          letter-spacing: 1px;
        }

        /* Chat Window */
        .wave-chat-window {
          position: fixed;
          right: 80px;
          top: 50%;
          transform: translateY(-50%);
          width: 360px;
          max-width: 92vw;
          height: 500px;
          background: linear-gradient(150deg, rgba(255, 255, 255, 0.82) 0%, rgba(245, 237, 255, 0.72) 55%, rgba(237, 242, 255, 0.72) 100%);
          backdrop-filter: blur(26px) saturate(165%);
          -webkit-backdrop-filter: blur(26px) saturate(165%);
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 26px;
          box-shadow:
            0 24px 70px rgba(124, 58, 237, 0.28),
            0 6px 20px rgba(236, 72, 153, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          animation: chat-slide-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .wave-chat-window.expanded {
          width: 560px;
          height: 82vh;
          max-height: 760px;
        }

        @media (max-width: 640px) {
          .wave-chat-window.expanded {
            width: 94vw;
            height: 88vh;
            right: 3vw;
          }
        }

        @keyframes chat-slide-in {
          0% { opacity: 0; transform: translateY(-50%) translateX(100px); }
          100% { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        .wave-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          pointer-events: none;
        }

        .wave-svg { width: 100%; height: 100%; }
        .wave-path { fill: url(#waveGradient); }

        /* Header */
        .wave-header {
          position: relative;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.92), rgba(168, 85, 247, 0.92), rgba(59, 130, 246, 0.9));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
          flex-shrink: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.18);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-avatar-container {
          position: relative;
          width: 42px;
          height: 42px;
        }

        .header-avatar {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 50%;
          padding: 5px;
          border: 2px solid white;
          overflow: hidden;
          z-index: 2;
        }

        .header-avatar img { width: 100%; height: 100%; object-fit: contain; }

        .header-pulse-ring {
          position: absolute;
          inset: -4px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        .header-title { color: white; font-size: 15px; font-weight: bold; }

        .header-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .close-button {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-action-button {
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .header-action-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(-25deg);
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* Messages */
        .messages-container {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
          min-height: 0;
        }

        .messages-container::-webkit-scrollbar { width: 4px; }
        .messages-container::-webkit-scrollbar-track { background: transparent; }
        .messages-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 3px;
        }

        .welcome-screen { text-align: center; padding: 20px 12px; }

        .welcome-wave-icon {
          font-size: 50px;
          background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave-wiggle 2s ease-in-out infinite;
        }

        @keyframes wave-wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .welcome-text { font-size: 16px; font-weight: 600; color: #7c3aed; margin: 12px 0 6px; }
        .welcome-subtitle { font-size: 13px; color: #a855f7; margin-bottom: 16px; }

        .quick-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }

        .topic-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 13px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 20px;
          font-size: 12px;
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.2s;
        }

        .topic-chip:hover {
          background: linear-gradient(135deg, rgba(250, 232, 255, 0.85), rgba(243, 232, 255, 0.85));
          border-color: rgba(168, 85, 247, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(168, 85, 247, 0.2);
        }

        .signin-chat-button {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border: none;
          color: white;
          padding: 9px 18px;
          border-radius: 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.25);
          transition: all 0.2s;
        }

        .signin-chat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(168, 85, 247, 0.35);
        }

        .message-wrapper { margin-bottom: 12px; animation: message-slide 0.3s ease-out; }

        @keyframes message-slide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-wrapper.user { display: flex; justify-content: flex-end; }

        .message-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 20px;
          position: relative;
        }

        .message-bubble.user {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(236, 72, 153, 0.95));
          color: white;
          border-bottom-right-radius: 5px;
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }

        .message-bubble.bot {
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          color: #1f2937;
          border-bottom-left-radius: 5px;
          box-shadow: 0 6px 18px rgba(124, 58, 237, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .message-avatar {
          width: 20px;
          height: 20px;
          background: #000;
          border-radius: 50%;
          padding: 2px;
          flex-shrink: 0;
        }

        .message-avatar.pulsing { animation: pulse 1s ease-in-out infinite; }
        .message-avatar img { width: 100%; height: 100%; object-fit: contain; }

        .message-name { font-size: 11px; font-weight: 600; color: #7c3aed; }

        .message-text {
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
        }

        /* ✅ Style the embedded links from the backend */
        .message-text a {
          color: #7c3aed;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }

        .message-text a:hover { color: #ec4899; }

        .message-image {
          display: block;
          width: 100%;
          max-height: 150px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 8px;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }

        .topic-match-card {
          margin-top: 10px;
          padding: 11px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(250, 245, 255, 0.7), rgba(239, 246, 255, 0.7));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(221, 214, 254, 0.8);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.1);
        }

        .topic-match-module {
          color: #7c3aed;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .topic-match-title {
          color: #1f2937;
          font-size: 14px;
          font-weight: 700;
          margin-top: 2px;
        }

        .topic-match-reason {
          color: #4b5563;
          font-size: 11px;
          line-height: 1.4;
          margin-top: 5px;
        }

        .topic-match-confidence {
          color: #6b7280;
          font-size: 10px;
          margin-top: 5px;
        }

        .open-topic-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 8px;
          padding: 7px 10px;
          border: none;
          border-radius: 9px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .open-topic-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(124, 58, 237, 0.25);
        }

        .alternative-topics {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          margin-top: 8px;
          font-size: 10px;
          color: #6b7280;
        }

        .alternative-topics button {
          border: none;
          padding: 0;
          background: transparent;
          color: #7c3aed;
          font-size: 11px;
          font-weight: 600;
          text-align: left;
          text-decoration: underline;
          cursor: pointer;
        }

        .message-wave {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 10px;
          opacity: 0.3;
          color: #a855f7;
        }

        .loading-message { background: white; border: 1.5px solid #e9d5ff; }

        .loading-dots { display: flex; align-items: center; gap: 10px; }

        .electromagnetic-pulse { display: flex; gap: 4px; }

        .pulse-dot {
          width: 7px;
          height: 7px;
          background: #a855f7;
          border-radius: 50%;
          animation: pulse-wave 1.4s ease-in-out infinite;
        }

        .pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .pulse-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse-wave {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .loading-text { font-size: 11px; color: #a855f7; }

        /* Input */
        .input-container {
          position: relative;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border-top: 1px solid rgba(255, 255, 255, 0.6);
          padding: 12px;
          z-index: 1;
          flex-shrink: 0;
        }

        .input-wave-decoration {
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 40px;
          pointer-events: none;
        }

        .input-wrapper { display: flex; gap: 8px; align-items: flex-end; }

        .image-file-input { display: none; }

        .camera-panel {
          margin-bottom: 8px;
          padding: 8px;
          border: 1px solid #e9d5ff;
          border-radius: 14px;
          background: #faf5ff;
        }

        .camera-video {
          width: 100%;
          max-height: 240px;
          object-fit: cover;
          border-radius: 10px;
          background: #000;
          display: block;
        }

        .camera-error {
          margin-top: 6px;
          color: #be123c;
          font-size: 10px;
          line-height: 1.3;
        }

        .camera-controls {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .camera-capture-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border: none;
          border-radius: 9px;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .camera-capture-button:disabled { opacity: 0.5; cursor: not-allowed; }

        .camera-cancel-button {
          padding: 8px 14px;
          border: 1.5px solid #e9d5ff;
          border-radius: 9px;
          color: #7c3aed;
          background: white;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .selected-image-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 6px;
          border: 1px solid #e9d5ff;
          border-radius: 12px;
          background: #faf5ff;
        }

        .active-doc-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 7px 9px;
          border: 1px solid #ddd6fe;
          border-radius: 12px;
          background: linear-gradient(135deg, #faf5ff, #eff6ff);
          color: #6d28d9;
        }

        .active-doc-details {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .active-doc-details strong {
          overflow: hidden;
          color: #4c1d95;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .active-doc-details span { color: #7c3aed; font-size: 9px; }

        .active-doc-chip > button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          border: none;
          border-radius: 50%;
          color: #7c3aed;
          background: white;
          cursor: pointer;
        }

        .doc-topic-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
          margin-top: 6px;
          padding: 7px 10px;
          border: 1px solid #ddd6fe;
          border-radius: 9px;
          background: white;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .doc-topic-row:hover { background: #f3e8ff; transform: translateY(-1px); }
        .doc-topic-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .selected-image-preview img {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          object-fit: cover;
          border-radius: 8px;
        }

        .selected-image-details {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .selected-image-details strong {
          overflow: hidden;
          color: #4c1d95;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .selected-image-details span { color: #7c3aed; font-size: 9px; }

        .selected-image-preview button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          border: none;
          border-radius: 50%;
          color: #7c3aed;
          background: white;
          cursor: pointer;
        }

        .upload-error {
          margin: -2px 2px 7px;
          color: #be123c;
          font-size: 10px;
          line-height: 1.3;
        }

        .attach-image-button {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 50%;
          color: #7c3aed;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          transition: all 0.2s;
        }

        .attach-image-button:not(:disabled):hover {
          border-color: rgba(168, 85, 247, 0.6);
          background: rgba(243, 232, 255, 0.8);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 14px rgba(168, 85, 247, 0.2);
        }

        .attach-image-button:disabled { opacity: 0.5; cursor: not-allowed; }

        .mic-button.listening {
          color: #fff;
          border-color: #ec4899;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          animation: mic-pulse 1.2s ease-in-out infinite;
        }

        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.5); }
          50% { box-shadow: 0 0 0 7px rgba(236, 72, 153, 0); }
        }

        .speak-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 50%;
          color: #7c3aed;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .speak-button:hover { background: #f3e8ff; }
        .speak-button.speaking { color: #ec4899; background: #fce7f3; }

        .wave-input {
          flex: 1;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 18px;
          padding: 9px 14px;
          font-size: 13px;
          resize: none;
          outline: none;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #3b0764;
          transition: all 0.2s;
          max-height: 80px;
          font-family: inherit;
        }

        .wave-input:focus {
          border-color: rgba(168, 85, 247, 0.65);
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }

        .wave-input::placeholder { color: #c084fc; }

        .wave-input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        /* ✅ Fixed: was "hheight" typo in original */
        .send-button {
          position: relative;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border: none;
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(168, 85, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .send-button:not(:disabled):hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
        }

        .send-button:not(:disabled):active { transform: scale(0.95); }

        .send-button:disabled { opacity: 0.5; cursor: not-allowed; }

        .button-wave {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: button-ripple 2s ease-in-out infinite;
        }

        @keyframes button-ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .wave-chat-window {
            right: 10px;
            width: calc(100vw - 60px);
            height: 420px;
          }

          .peek-character { width: 150px; height: 220px; }

          .character-body { width: 130px; height: 180px; }

          .toggle-arrow-button.visible { right: 150px; }
        }
      `}</style>
    </>
  );
}
