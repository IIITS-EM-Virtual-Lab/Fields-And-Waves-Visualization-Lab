const express = require('express');
const multer = require('multer');
const Groq = require('groq-sdk');
const { auth } = require('../middleware/auth');
const { courseCatalog, courseTopicByPath } = require('../data/courseCatalog');

const router = express.Router();

const CHATBOT_API_URL =
  process.env.CHATBOT_API_URL || 'https://fwvlab-fwv-ai-service.hf.space';

const MAX_COURSE_IMAGE_SIZE = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VISION_MODEL = process.env.GROQ_VISION_MODEL || 'qwen/qwen3.8-27b';

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

const getVisionClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'local-placeholder') return null;
  return new Groq({ apiKey });
};

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

module.exports = router;
