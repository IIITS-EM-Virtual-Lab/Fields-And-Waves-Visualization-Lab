const express = require('express');
const multer = require('multer');
const Groq = require('groq-sdk');
const pdfParse = require('pdf-parse');
const NodeCache = require('node-cache');
const { auth } = require('../middleware/auth');
const { courseCatalog, courseTopicByPath } = require('../data/courseCatalog');

const router = express.Router();

const CHATBOT_API_URL =
  process.env.CHATBOT_API_URL || 'https://fwvlab-fwv-ai-service.hf.space';

const MAX_COURSE_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';

const MAX_PDF_SIZE = 15 * 1024 * 1024;
// Characters of extracted PDF text sent to the model (keeps us within token limits).
const PDF_TEXT_BUDGET = 16000;
const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'openai/gpt-oss-120b';
// Holds each chat session's uploaded document for follow-up Q&A (30-minute TTL).
const docCache = new NodeCache({ stdTTL: 1800, checkperiod: 300 });

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COURSE_IMAGE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!SUPPORTED_IMAGE_TYPES.has(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG, and WebP images are supported.'));
    }
    return callback(null, true);
  },
});

const uploadCourseImage = (req, res, next) => {
  imageUpload.single('image')(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'The image is too large. Please upload an image smaller than 8 MB.',
      });
    }

    return res.status(415).json({
      success: false,
      message: error.message || 'The uploaded image is not supported.',
    });
  });
};

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf') {
      return callback(new Error('Only PDF files are supported.'));
    }
    return callback(null, true);
  },
});

const uploadCoursePdf = (req, res, next) => {
  pdfUpload.single('pdf')(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'The PDF is too large. Please upload a file smaller than 15 MB.',
      });
    }

    return res.status(415).json({
      success: false,
      message: error.message || 'The uploaded file is not supported.',
    });
  });
};

const getVisionClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'local-placeholder') return null;
  return new Groq({ apiKey });
};

// Groq client for text models (same key; separate helper for clarity).
const getTextClient = () => getVisionClient();

const buildCourseCatalogForPrompt = () =>
  courseCatalog.map(({ title, module, path, signals }) => ({ title, module, path, signals }));

const parseTopicMatch = (rawContent) => {
  const parsed = JSON.parse(rawContent || '{}');
  const topic = courseTopicByPath.get(parsed.path);

  if (!topic) {
    return { topic: null, alternatives: [] };
  }

  const confidence = Number(parsed.confidence);
  const alternatives = Array.isArray(parsed.alternative_paths)
    ? parsed.alternative_paths
      .map((path) => courseTopicByPath.get(path))
      .filter((alternative) => alternative && alternative.path !== topic.path)
      .slice(0, 2)
      .map(({ title, module, path }) => ({ title, module, path }))
    : [];

  return {
    topic: {
      title: topic.title,
      module: topic.module,
      path: topic.path,
      observedTopic: typeof parsed.observed_topic === 'string' ? parsed.observed_topic : topic.title,
      reason: typeof parsed.reason === 'string' ? parsed.reason : 'This is the closest topic in the course.',
      confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : null,
    },
    alternatives,
  };
};

router.post('/ask', auth, async (req, res) => {
  try {
    const { query, session_id } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query is required',
      });
    }

    const response = await fetch(`${CHATBOT_API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        session_id: session_id || `user-${req.user._id}`,
        user_id: req.user._id,
        user_email: req.user.email,
        user_name: req.user.name,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Chatbot service error',
      });
    }

    return res.json(data);
  } catch (error) {
    console.error('Chat proxy error:', error);
    return res.status(502).json({
      success: false,
      message: 'Unable to reach chatbot service',
    });
  }
});

router.post('/find-topic', auth, uploadCourseImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image to find a course topic.',
    });
  }

  const groq = getVisionClient();
  if (!groq) {
    return res.status(503).json({
      success: false,
      message: 'Image topic matching is not configured yet. Add a GROQ_API_KEY to the backend environment.',
    });
  }

  try {
    const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const optionalQuestion = typeof req.body.question === 'string' ? req.body.question.trim() : '';
    const catalog = buildCourseCatalogForPrompt();

    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You identify the electromagnetic-engineering concept shown in an uploaded image and map it to this course catalog.',
            'Inspect diagrams, equations, labels, plots, components, and visible text.',
            'Choose only a path that appears verbatim in the supplied catalog. Never invent a URL.',
            'If the image is unrelated or too unclear, return an empty path and low confidence.',
            'Return JSON only with: path, observed_topic, reason, confidence, alternative_paths.',
            'confidence must be from 0 to 1 and alternative_paths must contain at most two catalog paths.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Course catalog: ${JSON.stringify(catalog)}\nLearner note: ${optionalQuestion || 'Find the closest topic in the course.'}`,
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
    });

    const match = parseTopicMatch(completion.choices[0]?.message?.content);
    if (!match.topic) {
      return res.json({
        success: true,
        answer: "I couldn't confidently connect this image to one of the current course topics. Try a clearer crop that includes the equation, diagram labels, or topic heading.",
        topic: null,
        alternatives: [],
      });
    }

    return res.json({
      success: true,
      answer: `This looks most relevant to ${match.topic.title} in ${match.topic.module}.`,
      topic: match.topic,
      alternatives: match.alternatives,
    });
  } catch (error) {
    console.error('Image topic matching error:', error);
    return res.status(502).json({
      success: false,
      message: 'Fieldora could not analyze that image right now. Please try again.',
    });
  }
});

router.post('/upload-pdf', auth, uploadCoursePdf, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF to analyze.',
    });
  }

  const groq = getTextClient();
  if (!groq) {
    return res.status(503).json({
      success: false,
      message: 'Document analysis is not configured yet. Add a GROQ_API_KEY to the backend environment.',
    });
  }

  const sessionId = typeof req.body.session_id === 'string' ? req.body.session_id : '';
  const fileName = req.file.originalname || 'document.pdf';

  let text = '';
  try {
    const parsed = await pdfParse(req.file.buffer);
    text = (parsed.text || '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  } catch (error) {
    console.error('PDF parse error:', error);
    return res.status(422).json({
      success: false,
      message: 'Could not read that PDF. It may be corrupted or password-protected.',
    });
  }

  if (!text) {
    return res.status(422).json({
      success: false,
      message: "This PDF has no selectable text (it may be scanned images). Try a text-based PDF.",
    });
  }

  const truncated = text.length > PDF_TEXT_BUDGET;
  const docText = text.slice(0, PDF_TEXT_BUDGET);

  // Cache the extracted text so follow-up questions can be answered from it.
  if (sessionId) {
    docCache.set(sessionId, { text: docText, name: fileName, truncated });
  }

  try {
    const catalog = buildCourseCatalogForPrompt();
    const completion = await groq.chat.completions.create({
      model: TEXT_MODEL,
      temperature: 0.1,
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You analyze an electromagnetics study document and map it to this course catalog.',
            'Identify the main topics the document covers.',
            'Choose only paths that appear verbatim in the supplied catalog. Never invent a URL.',
            'Return JSON only with: summary (at most two sentences), topics, confidence.',
            'topics is an array of at most three objects { path, reason }, most relevant first, each path from the catalog.',
            'confidence must be from 0 to 1.',
          ].join(' '),
        },
        {
          role: 'user',
          content: `Course catalog: ${JSON.stringify(catalog)}\n\nDocument "${fileName}":\n${docText}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    // The model may return each topic as a string path or an object { path, reason }.
    const topics = Array.isArray(parsed.topics)
      ? parsed.topics
        .map((entry) => {
          const path = typeof entry === 'string' ? entry : entry && entry.path;
          return { entry, topic: courseTopicByPath.get(path) };
        })
        .filter((item) => item.topic)
        .slice(0, 3)
        .map(({ entry, topic }) => ({
          title: topic.title,
          module: topic.module,
          path: topic.path,
          reason: entry && typeof entry.reason === 'string' ? entry.reason : '',
        }))
      : [];

    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
    const topicList = topics.map((t) => t.title).join(', ');
    const answer = topics.length
      ? `I've read "${fileName}". It covers ${topicList}. Ask me anything about it.`
      : `I've read "${fileName}". Ask me anything about it.`;

    return res.json({
      success: true,
      name: fileName,
      summary,
      topics,
      truncated,
      docLoaded: Boolean(sessionId),
      answer,
    });
  } catch (error) {
    console.error('PDF topic mapping error:', error);
    // The document is cached, so Q&A still works even if mapping failed.
    return res.json({
      success: true,
      name: fileName,
      summary: '',
      topics: [],
      truncated,
      docLoaded: Boolean(sessionId),
      answer: `I've read "${fileName}". Ask me anything about it.`,
    });
  }
});

router.post('/ask-doc', auth, async (req, res) => {
  const { query, session_id } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const doc = session_id ? docCache.get(session_id) : null;
  if (!doc) {
    return res.status(409).json({
      success: false,
      message: 'No active document for this chat. Please upload a PDF first.',
    });
  }

  const groq = getTextClient();
  if (!groq) {
    return res.status(503).json({
      success: false,
      message: 'Document Q&A is not configured yet. Add a GROQ_API_KEY to the backend environment.',
    });
  }

  try {
    const catalog = buildCourseCatalogForPrompt();
    const completion = await groq.chat.completions.create({
      model: TEXT_MODEL,
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            "You are Fieldora, an electromagnetics tutor. Answer the student's question using the provided document excerpt as the primary source, supported by the course catalog.",
            'Ground the answer in the document; if the document does not address it, say so briefly and then answer from general electromagnetics knowledge.',
            'Cite the single most relevant catalog topic (a path that appears verbatim in the catalog, or null). Never invent a URL.',
            'Write the answer as clear plain text (no markdown symbols).',
            'Return JSON only with: answer, citation ({ path } or null).',
          ].join(' '),
        },
        {
          role: 'user',
          content: `Course catalog: ${JSON.stringify(catalog)}\n\nDocument "${doc.name}":\n${doc.text}\n\nStudent question: ${query.trim()}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    // citation may come back as a string path or an object { path }.
    const citedPath = typeof parsed.citation === 'string'
      ? parsed.citation
      : parsed.citation && parsed.citation.path;
    const cited = citedPath ? courseTopicByPath.get(citedPath) : null;

    return res.json({
      success: true,
      answer: typeof parsed.answer === 'string' && parsed.answer.trim()
        ? parsed.answer.trim()
        : "I couldn't form an answer from the document. Try rephrasing your question.",
      topic: cited ? { title: cited.title, module: cited.module, path: cited.path } : null,
    });
  } catch (error) {
    console.error('Document Q&A error:', error);
    return res.status(502).json({
      success: false,
      message: 'Fieldora could not answer from the document right now. Please try again.',
    });
  }
});

module.exports = router;
