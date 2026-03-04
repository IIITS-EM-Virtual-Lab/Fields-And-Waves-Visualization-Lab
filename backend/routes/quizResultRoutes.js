const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const { auth } = require('../middleware/auth');

// ── Save quiz result ────────────────────────────────────────
// Fixed: now saves chapter and userAnswers (were missing before)
router.post('/save', auth, async (req, res) => {
  try {
    const {
      quizId,
      score,
      correctAnswers,
      totalQuestions,
      accuracy,
      module,
      chapter,
      userAnswers
    } = req.body;

    const userId = req.user.id;

    const newResult = new QuizResult({
      userId,
      quizId,
      score,
      correctAnswers,
      totalQuestions,
      accuracy,
      module,
      chapter: chapter || '',
      userAnswers: userAnswers || [],
      completedAt: new Date(),
    });

    await newResult.save();
    res.status(201).json({ success: true, message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ success: false, message: 'Failed to save quiz result' });
  }
});

// ── Get quiz history ────────────────────────────────────────
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz history' });
  }
});

// ── Overall stats (best attempt per quiz) ──────────────────
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = new mongoose.Types.ObjectId(userId);

    const bestAttempts = await QuizResult.aggregate([
      { $match: { userId: uid } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$quizId',
          score: { $first: '$score' },
          correctAnswers: { $first: '$correctAnswers' },
          totalQuestions: { $first: '$totalQuestions' },
          accuracy: { $first: '$accuracy' },
        }
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestionsAttempted: { $sum: '$totalQuestions' },
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracy' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPoints: 1,
          totalQuizzes: 1,
          averageScore: { $round: ['$averageScore', 1] },
          accuracy: { $round: ['$averageAccuracy', 1] }
        }
      }
    ]);

    const overall = bestAttempts[0] || {
      totalPoints: 0,
      totalQuizzes: 0,
      averageScore: 0,
      accuracy: 0
    };

    res.json({ success: true, data: { overall } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
});

// ── User quiz results with populated questions ──────────────
// Fixed: only returns the questions the student actually answered
// by filtering quiz questions to match the stored userAnswers questionIds
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, module, sortBy = 'completedAt', sortOrder = 'desc' } = req.query;

    const query = { userId };
    if (module) query.module = module;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const results = await QuizResult.find(query)
      .populate({
        path: 'quizId',
        select: 'module chapter questions',
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // For each result, filter the quiz's questions down to only
    // the ones the student actually saw (matched by userAnswers questionIds)
    const enriched = results.map(result => {
      const resultObj = result.toObject();

      if (resultObj.quizId && resultObj.quizId.questions && resultObj.userAnswers) {
        const answeredIds = new Set(
          resultObj.userAnswers.map((ua) => ua.questionId.toString())
        );
        resultObj.quizId.questions = resultObj.quizId.questions.filter(
          (q) => answeredIds.has(q._id.toString())
        );
      }

      return resultObj;
    });

    const total = await QuizResult.countDocuments(query);

    res.json({
      success: true,
      data: enriched,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalResults: total,
        hasNextPage: skip + results.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
      error: error.message
    });
  }
});

// ── Topic-wise stats (best attempt per quiz) ────────────────
router.get('/stats-by-topic/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = new mongoose.Types.ObjectId(userId);

    const bestAttempts = await QuizResult.aggregate([
      { $match: { userId: uid } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$quizId',
          module: { $first: '$module' },
          score: { $first: '$score' },
          correctAnswers: { $first: '$correctAnswers' },
          totalQuestions: { $first: '$totalQuestions' },
          accuracy: { $first: '$accuracy' }
        }
      },
      {
        $group: {
          _id: '$module',
          completedQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          accuracySum: { $sum: '$accuracy' }
        }
      },
      {
        $project: {
          _id: 0,
          module: '$_id',
          completedQuizzes: 1,
          averageScore: { $round: [{ $divide: ['$totalScore', '$completedQuizzes'] }, 1] },
          accuracy: { $round: [{ $divide: ['$accuracySum', '$completedQuizzes'] }, 1] },
          overallAccuracy: {
            $round: [{ $multiply: [{ $divide: ['$totalCorrectAnswers', '$totalQuestions'] }, 100] }, 1]
          }
        }
      }
    ]);

    const allQuizzes = await Quiz.aggregate([
      { $group: { _id: '$module', totalQuizzes: { $sum: 1 } } }
    ]);

    const totalsMap = allQuizzes.reduce((acc, cur) => {
      acc[cur._id] = cur.totalQuizzes;
      return acc;
    }, {});

    const result = {};
    bestAttempts.forEach(stat => {
      result[stat.module] = {
        accuracy: stat.accuracy,
        completedQuizzes: stat.completedQuizzes,
        totalQuizzes: totalsMap[stat.module] || 0,
        averageScore: stat.averageScore,
        overallAccuracy: stat.overallAccuracy
      };
    });

    res.json({ success: true, data: result, message: 'Topic statistics retrieved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch topic stats', error: err.message });
  }
});

module.exports = router;