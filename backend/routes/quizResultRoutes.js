const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ADD THIS IMPORT
const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const { auth } = require('../middleware/auth');

// Submit quiz result - IMPROVED VERSION
router.post('/', auth, async (req, res) => {
  try {
    const { userId, quizId, score, correctAnswers, totalQuestions } = req.body;
    console.log(req.body);

    console.log('📥 Received quiz result data:', req.body);

    // Enhanced validation
    if (!userId || !quizId || score === undefined || correctAnswers === undefined || totalQuestions === undefined) {
      console.error('❌ Missing required fields:', { userId, quizId, score, correctAnswers, totalQuestions });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        receivedData: { userId, quizId, score, correctAnswers, totalQuestions }
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      console.error('❌ Invalid ObjectId format:', { userId, quizId });
      return res.status(400).json({
        success: false,
        message: 'Invalid userId or quizId format'
      });
    }

    // Fetch quiz details for module and chapter info
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.error('❌ Quiz not found:', quizId);
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate accuracy
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Create quiz result
    const quizResultData = {
      userId: new mongoose.Types.ObjectId(userId),
      quizId: new mongoose.Types.ObjectId(quizId),
      score: Number(score),
      correctAnswers: Number(correctAnswers),
      totalQuestions: Number(totalQuestions),
      accuracy,
      module: quiz.module,
      chapter: quiz.chapter || ''
    };

    console.log('💾 Creating quiz result with data:', quizResultData);

    const quizResult = new QuizResult(quizResultData);
    await quizResult.save();

    console.log('✅ Quiz result saved successfully:', quizResult);

    res.status(201).json({
      success: true,
      message: 'Quiz result saved successfully',
      data: quizResult
    });

  } catch (error) {
    console.error('❌ Error saving quiz result:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save quiz result',
      error: error.message
    });
  }
});

// Get user's quiz results
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, module, sortBy = 'completedAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = { userId };
    if (module) {
      query.module = module;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch results with pagination
    const results = await QuizResult.find(query)
      .populate('quizId', 'module chapter')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QuizResult.countDocuments(query);

    res.json({
      success: true,
      data: results,
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

// Get user statistics
router.get('/stats/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Aggregate user statistics
    const stats = await QuizResult.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestionsAttempted: { $sum: '$totalQuestions' },
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracy' },
          highestScore: { $max: '$score' },
          recentQuizzes: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          totalPoints: 1,
          totalQuizzes: 1,
          averageScore: { $round: ['$averageScore', 1] },
          accuracy: { $round: ['$averageAccuracy', 1] },
          highestScore: 1,
          recentQuizzes: { $slice: ['$recentQuizzes', -5] }
        }
      }
    ]);

    // Module-wise statistics
    const moduleStats = await QuizResult.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$module',
          totalPoints: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          averageAccuracy: { $avg: '$accuracy' },
          bestScore: { $max: '$score' }
        }
      },
      {
        $project: {
          module: '$_id',
          _id: 0,
          totalPoints: 1,
          totalQuizzes: 1,
          averageAccuracy: { $round: ['$averageAccuracy', 1] },
          bestScore: 1
        }
      },
      { $sort: { totalPoints: -1 } }
    ]);

    const result = {
      overall: stats[0] || {
        totalPoints: 0,
        totalQuizzes: 0,
        averageScore: 0,
        accuracy: 0,
        highestScore: 0,
        recentQuizzes: []
      },
      moduleStats: moduleStats
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

module.exports = router;