import { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Zap, Hand, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ChatBot() {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.client);

  // 🚫 Hide chatbot completely on quiz page
  if (location.pathname.includes("quiz")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls if Fieldora is visible at all
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [peekState, setPeekState] = useState<"hidden" | "peeking" | "full">("peeking");
  const [waves, setWaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waveIdRef = useRef(0);
  const peekTimeoutRef = useRef<NodeJS.Timeout>();

  const getChatSessionId = () => {
    if (user?._id) {
      return `user-${user._id}`;
    }

    const existing = localStorage.getItem("fwv_chat_session_id");
    if (existing) return existing;

    const newId = `anon-${window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem("fwv_chat_session_id", newId);
    return newId;
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Waving animation
  useEffect(() => {
    if (isOpen || !isVisible) return;

    const waveTimeout = setTimeout(() => {
      setIsWaving(true);

      setTimeout(() => {
        setIsWaving(false);
      }, 2000);
    }, 1000);

    return () => clearTimeout(waveTimeout);
  }, [isOpen, isVisible]);

  // Create wave ripple effect
  const createWave = (x: number, y: number) => {
    const newWave = { id: waveIdRef.current++, x, y };
    setWaves((prev) => [...prev, newWave]);
    setTimeout(() => {
      setWaves((prev) => prev.filter((w) => w.id !== newWave.id));
    }, 1000);
  };

  // Handle typing to create waves
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > input.length) {
      const rect = e.target.getBoundingClientRect();
      createWave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    // Create multiple waves on send
    const chatRect = document.querySelector(".wave-chat-window")?.getBoundingClientRect();
    if (chatRect) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createWave(
            chatRect.left + chatRect.width / 2,
            chatRect.top + chatRect.height / 2
          );
        }, i * 100);
      }
    }

    try {
      const response = await fetch(
        "https://obeliskoid-elwanda-covetously.ngrok-free.dev/ask",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420" 
          },
          body: JSON.stringify({ 
            query: userMessage,
            session_id: getChatSessionId(),
            user_id: user?._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Service unavailable");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "🔧 Oops! I'm currently out of service. My electromagnetic field is being recharged! I'll be back online soon. Please try again in a bit! ⚡",
        },
      ]);
    }

    setLoading(false);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setPeekState("full");
      // Create waves when opening
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

  return (
    <>
      {/* Wave Ripples */}
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="wave-ripple"
          style={{
            left: wave.x,
            top: wave.y,
          }}
        />
      ))}

      {/* Toggle Arrow Button (always visible) */}
      <button
        onClick={toggleVisibility}
        className={`toggle-arrow-button ${isVisible ? 'visible' : 'hidden'}`}
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
          {/* Background glow effect */}
          <div className="peek-glow" />
          
          {/* Main character container */}
          <div className="peek-character">
            {/* Electromagnetic field effect */}
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

            {/* Character body with logo */}
            <div className="character-body">
              <div className="logo-container">
                <img
                  src="/fwvlab.png"
                  alt="Fieldora"
                  className="character-logo"
                />
              </div>
              
              {/* Cute eyes */}
              <div className="character-eyes">
                <div className="eye left">
                  <div className="pupil" />
                </div>
                <div className="eye right">
                  <div className="pupil" />
                </div>
              </div>

              {/* Waving hand */}
              <div className={`waving-hand ${isWaving ? 'active' : ''}`}>
                <Hand size={24} />
              </div>

              {/* Sparkle effects */}
              <Sparkles className="sparkle sparkle-1" size={16} />
              <Sparkles className="sparkle sparkle-2" size={12} />
              <Zap className="zap-effect" size={14} />
            </div>

            {/* Speech bubble */}
            <div className="peek-bubble">
              <div className="bubble-text">
                {peekState === "peeking" ? "Hey there! 👋" : "Click me!"}
              </div>
            </div>
          </div>

          {/* Edge indicator (always visible even when hidden) */}
          <div className="edge-indicator">
            <div className="indicator-line" />
            <div className="indicator-dot" />
            <div className="indicator-text">Fieldora</div>
          </div>
        </div>
      )}

      {/* Wave Visualizer Chat Window */}
      {isOpen && isVisible && (
        <div className="wave-chat-window">
          {/* Animated wave background */}
          <div className="wave-background">
            <svg className="wave-svg" viewBox="0 0 1200 320">
              <path
                className="wave-path wave-1"
                d="M0,160 Q300,100 600,160 T1200,160 L1200,320 L0,320 Z"
              />
              <path
                className="wave-path wave-2"
                d="M0,192 Q300,140 600,192 T1200,192 L1200,320 L0,320 Z"
              />
              <path
                className="wave-path wave-3"
                d="M0,224 Q300,180 600,224 T1200,224 L1200,320 L0,320 Z"
              />
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
                  Your AI Field Guide ∿
                </div>
              </div>
            </div>
            <button onClick={toggleChat} className="close-button">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-screen">
                <div className="welcome-wave-icon">∿</div>
                <div className="welcome-text">
                  Ready to explore the electromagnetic universe?
                </div>
                <div className="welcome-subtitle">
                  Ask me anything about Fields & Waves
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

            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className={`message-bubble ${msg.role}`}>
                  {msg.role === "bot" && (
                    <div className="message-header">
                      <div className="message-avatar">
                        <img src="/fwvlab.png" alt="Fieldora" />
                      </div>
                      <span className="message-name">Fieldora</span>
                    </div>
                  )}
                  {msg.role === "bot" ? (
                    <div
                      className="message-text"
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br />") }}
                    />
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )}
                  {msg.role === "bot" && (
                    <svg className="message-wave" viewBox="0 0 100 10">
                      <path
                        d="M0,5 Q25,0 50,5 T100,5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
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
                    <span className="loading-text">Processing waves...</span>
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
            <div className="input-wrapper">
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
                placeholder="Send a wave of curiosity..."
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="send-button"
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

        .toggle-arrow-button.hidden {
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
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(20);
          }
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

        /* Background glow */
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

        /* Character Container */
        .peek-character {
          position: relative;
          width: 200px;
          height: 280px;
        }

        /* Electromagnetic field effect */
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
          background: linear-gradient(90deg, 
            transparent, 
            rgba(168, 85, 247, 0.5),
            transparent
          );
          animation: field-pulse 2s ease-in-out infinite;
        }

        @keyframes field-pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: rotate(var(--rotation)) scaleX(0.8);
          }
          50% { 
            opacity: 1;
            transform: rotate(var(--rotation)) scaleX(1.5);
          }
        }

        /* Character body */
        .character-body {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 160px;
          height: 220px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-radius: 100px 0 0 100px;
          box-shadow: 
            -10px 0 40px rgba(168, 85, 247, 0.3),
            inset 5px 0 20px rgba(168, 85, 247, 0.1);
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

        /* Cute eyes */
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

        /* Waving hand */
        .waving-hand {
          position: absolute;
          left: -30px;
          top: 40%;
          color: #fbbf24;
          opacity: 0;
          transform: rotate(0deg);
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

        /* Sparkles */
        .sparkle {
          position: absolute;
          color: #fbbf24;
          animation: sparkle-float 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: 20px;
          right: 10px;
        }

        .sparkle-2 {
          bottom: 30px;
          right: 15px;
          animation-delay: 1s;
        }

        @keyframes sparkle-float {
          0%, 100% { 
            opacity: 0;
            transform: translateY(0) scale(0.8) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: translateY(-10px) scale(1.2) rotate(180deg);
          }
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

        /* Speech bubble */
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

        /* Edge indicator (always visible) */
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

        /* Chat Window Styles */
        .wave-chat-window {
          position: fixed;
          right: 80px;
          top: 50%;
          transform: translateY(-50%);
          width: 360px;
          max-width: 90vw;
          height: 500px;
          background: linear-gradient(135deg, #faf5ff 0%, #fdf4ff 100%);
          border-radius: 30px;
          box-shadow: 
            0 20px 60px rgba(168, 85, 247, 0.3),
            0 0 0 1px rgba(168, 85, 247, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          animation: chat-slide-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes chat-slide-in {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(100px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        .wave-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          pointer-events: none;
        }

        .wave-svg {
          width: 100%;
          height: 100%;
        }

        .wave-path {
          fill: url(#waveGradient);
        }

        /* Header */
        .wave-header {
          position: relative;
          background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-avatar-container {
          position: relative;
          width: 48px;
          height: 48px;
        }

        .header-avatar {
          position: relative;
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 50%;
          padding: 6px;
          border: 2px solid white;
          overflow: hidden;
          z-index: 2;
        }

        .header-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

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

        .header-title {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }

        .header-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* Messages */
        .messages-container {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 3px;
        }

        .welcome-screen {
          text-align: center;
          padding: 30px 16px;
        }

        .welcome-wave-icon {
          font-size: 60px;
          background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave-wiggle 2s ease-in-out infinite;
        }

        @keyframes wave-wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .welcome-text {
          font-size: 18px;
          font-weight: 600;
          color: #7c3aed;
          margin: 16px 0 8px;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: #a855f7;
          margin-bottom: 24px;
        }

        .quick-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .topic-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #e9d5ff;
          border-radius: 20px;
          font-size: 13px;
          color: #7c3aed;
          cursor: pointer;
          transition: all 0.2s;
        }

        .topic-chip:hover {
          background: linear-gradient(135deg, #fae8ff, #f3e8ff);
          border-color: #a855f7;
          transform: translateY(-2px);
        }

        .message-wrapper {
          margin-bottom: 16px;
          animation: message-slide 0.3s ease-out;
        }

        @keyframes message-slide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-wrapper.user {
          display: flex;
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 20px;
          position: relative;
        }

        .message-bubble.user {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.bot {
          background: white;
          border: 2px solid #e9d5ff;
          color: #1f2937;
          border-bottom-left-radius: 4px;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .message-avatar {
          width: 24px;
          height: 24px;
          background: #000;
          border-radius: 50%;
          padding: 3px;
        }

        .message-avatar.pulsing {
          animation: pulse 1s ease-in-out infinite;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .message-name {
          font-size: 12px;
          font-weight: 600;
          color: #7c3aed;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
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

        .loading-message {
          background: white;
          border: 2px solid #e9d5ff;
        }

        .loading-dots {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .electromagnetic-pulse {
          display: flex;
          gap: 4px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #a855f7;
          border-radius: 50%;
          animation: pulse-wave 1.4s ease-in-out infinite;
        }

        .pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .pulse-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse-wave {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        .loading-text {
          font-size: 12px;
          color: #a855f7;
        }

        /* Input */
        .input-container {
          position: relative;
          background: white;
          border-top: 2px solid #e9d5ff;
          padding: 12px;
          z-index: 1;
        }

        .input-wave-decoration {
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 40px;
          pointer-events: none;
        }

        .input-wave-path {
          animation: input-wave 3s ease-in-out infinite;
        }

        @keyframes input-wave {
          0%, 100% { d: path("M0,20 Q100,10 200,20 T400,20"); }
          50% { d: path("M0,20 Q100,30 200,20 T400,20"); }
        }

        .input-wrapper {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .wave-input {
          flex: 1;
          border: 2px solid #e9d5ff;
          border-radius: 20px;
          padding: 10px 14px;
          font-size: 13px;
          resize: none;
          outline: none;
          background: linear-gradient(135deg, #faf5ff, #ffffff);
          transition: all 0.2s;
        }

        .wave-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .wave-input::placeholder {
          color: #c084fc;
        }

        .send-button {
          position: relative;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border: none;
          color: white;
          width: 40px;
          hheight: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
        }

        .send-button:not(:disabled):hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
        }

        .send-button:not(:disabled):active {
          transform: scale(0.95);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

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

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .wave-chat-window {
            right: 40px;
            width: calc(100vw - 80px);
          }

          .peek-character {
            width: 150px;
            height: 220px;
          }

          .character-body {
            width: 130px;
            height: 180px;
          }

          .toggle-arrow-button.visible {
            right: 150px;
          }
        }
      `}</style>
    </>
  );
}