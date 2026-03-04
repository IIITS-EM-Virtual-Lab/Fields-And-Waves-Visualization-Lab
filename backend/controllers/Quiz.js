const Quiz = require('../models/Quiz');
const { v2: cloudinary } = require('cloudinary');
const uploader = cloudinary.uploader;
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Get all quizzes for a module
exports.getModuleQuizzes = async (req, res) => {
  try {
    const { moduleName } = req.params;
    const quiz = await Quiz.findOne({ module: moduleName, chapter: "" });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Module quiz not found" });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching module-level quiz",
      error: error.message,
    });
  }
};

// Get quiz for a specific chapter
exports.getChapterQuiz = async (req, res) => {
  try {
    const { moduleName, chapterName } = req.params;
    const quiz = await Quiz.findOne({
      module: moduleName,
      chapter: chapterName
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found for this chapter'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chapter quiz',
      error: error.message
    });
  }
};

// Create new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating quiz',
      error: error.message
    });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting quiz',
      error: error.message
    });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    let {
      question,
      type,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points
    } = req.body;

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    try {
      if (typeof options === 'string') options = JSON.parse(options);
      if (typeof correctAnswer === 'string') correctAnswer = JSON.parse(correctAnswer);
    } catch (parseErr) {
      return res.status(400).json({ message: 'Failed to parse options or correctAnswer', error: parseErr.message });
    }

    const questionObj = {
      question,
      type,
      options: options || [],
      correctAnswer: correctAnswer || [],
      explanation,
      difficulty,
      points: Number(points)
    };

    if (req.files?.questionImage?.[0]) {
      questionObj.imageUrl = req.files.questionImage[0].path;
    }

    if (req.files?.solutionImage?.[0]) {
      questionObj.solutionImageUrl = req.files.solutionImage[0].path;
    }

    quiz.questions.push(questionObj);
    await quiz.save();

    res.status(201).json({ message: 'Question added successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add question', error: err.message });
  }
};

// Update question with support for questionImage and solutionImage
exports.updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const updateData = req.body;

    if (typeof updateData.options === 'string') updateData.options = JSON.parse(updateData.options);
    if (typeof updateData.correctAnswer === 'string') updateData.correctAnswer = JSON.parse(updateData.correctAnswer);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) return res.status(404).json({ success: false, message: 'Question not found' });

    if (req.files?.questionImage?.[0]) {
      updateData.imageUrl = req.files.questionImage[0].path;
    }
    if (req.files?.solutionImage?.[0]) {
      updateData.solutionImageUrl = req.files.solutionImage[0].path;
    }

    quiz.questions[questionIndex] = {
      ...quiz.questions[questionIndex].toObject(),
      ...updateData
    };

    await quiz.save();
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating question', error: error.message });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const question = quiz.questions.find(q => q._id.toString() === questionId);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
    await quiz.save();

    res.status(200).json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting question', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// AI Question Generation
// POST /api/quizzes/generate-questions
// Body: { topic, difficulty, count, module, chapter }
// ─────────────────────────────────────────────────────────────
exports.generateQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count = 5, module, chapter } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'topic and difficulty are required'
      });
    }

    const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
    if (!validDifficulties.includes(difficulty.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'difficulty must be EASY, MEDIUM, or HARD'
      });
    }

    const difficultyUpper = difficulty.toUpperCase();

    // Points assigned by difficulty
    const pointsMap = { EASY: 1, MEDIUM: 2, HARD: 3 };
    const points = pointsMap[difficultyUpper];

    const prompt = `You are an expert professor creating MCQ exam questions for an undergraduate engineering course on Fields and Waves (Electromagnetics).

Topic: ${topic}
Module: ${module || 'General'}
Chapter: ${chapter || 'General'}
Difficulty: ${difficultyUpper}
Number of questions: ${count}

Generate exactly ${count} MCQ questions. Each question must:
- Be relevant to the topic and appropriate for the difficulty level
- Have exactly 4 options (A, B, C, D)
- Have exactly one correct answer
- Include a brief explanation for why the correct answer is right
- For EASY: test basic concept recall
- For MEDIUM: test application and understanding
- For HARD: test problem-solving with calculations or deep analysis

Respond ONLY with a valid JSON array. No preamble, no markdown, no backticks. Just the raw JSON array.

Format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation of why Option A is correct.",
    "difficulty": "${difficultyUpper}",
    "points": ${points},
    "type": "MCQ"
  }
]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const rawText = message.content[0].text.trim();

    let questions;
    try {
      questions = JSON.parse(rawText);
    } catch (parseErr) {
      // Sometimes AI wraps in ```json ... ``` even when told not to — strip it
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      questions = JSON.parse(cleaned);
    }

    if (!Array.isArray(questions)) {
      throw new Error('AI did not return an array of questions');
    }

    // Normalise — ensure every field is present
    const normalised = questions.map(q => ({
      type: 'MCQ',
      question: q.question || '',
      options: q.options || [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      difficulty: difficultyUpper,
      points: points,
    }));

    res.status(200).json({
      success: true,
      data: normalised
    });

  } catch (error) {
    console.error('❌ AI question generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions',
      error: error.message
    });
  }
};