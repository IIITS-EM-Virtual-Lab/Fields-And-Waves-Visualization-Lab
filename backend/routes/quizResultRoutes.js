const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const { auth } = require('../middleware/auth');

// Submit quiz result - IMPROVED VERSION
router.post('/', auth, async (req, res) => {
  try {
    const { userId, quizId, score, correctAnswers, totalQuestions, userAnswers } = req.body;

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
      chapter: quiz.chapter || '',
      userAnswers: userAnswers || [] // Add userAnswers to the data
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

// Get user's quiz results with detailed quiz questions
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

    // Fetch results with pagination and populate quiz details INCLUDING questions
    const results = await QuizResult.find(query)
      .populate({
        path: 'quizId',
        select: 'module chapter questions',
        populate: {
          path: 'questions',
          select: 'question options correctAnswer explanation imageUrl solutionImageUrl points difficulty type'
        }
      })
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

// NEW: Get topic-wise statistics for user dashboard
router.get('/stats-by-topic/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId format'
      });
    }

    // Get all available quizzes grouped by module to calculate totalQuizzes
    const allQuizzes = await Quiz.aggregate([
      {
        $group: {
          _id: '$module',
          totalQuizzes: { $sum: 1 }
        }
      }
    ]);

    // Create a map of module to total quizzes
    const moduleQuizCount = {};
    allQuizzes.forEach(item => {
      moduleQuizCount[item._id] = item.totalQuizzes;
    });

    // Aggregate topic-wise statistics from quiz results
    const topicStats = await QuizResult.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$module',
          completedQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: '$totalQuestions' },
          accuracySum: { $sum: '$accuracy' },
          bestScore: { $max: '$score' },
          recentAttempts: { $push: { score: '$score', accuracy: '$accuracy', completedAt: '$completedAt' } }
        }
      },
      {
        $project: {
          _id: 0,
          module: '$_id',
          completedQuizzes: 1,
          averageScore: { $round: [{ $divide: ['$totalScore', '$completedQuizzes'] }, 1] },
          accuracy: { $round: [{ $divide: ['$accuracySum', '$completedQuizzes'] }, 1] },
          bestScore: 1,
          overallAccuracy: { 
            $round: [
              { $multiply: [{ $divide: ['$totalCorrectAnswers', '$totalQuestions'] }, 100] }, 
              1
            ] 
          },
          recentAttempts: { $slice: ['$recentAttempts', -5] }
        }
      },
      { $sort: { accuracy: -1 } }
    ]);

    // Transform the result to match the expected format
    const result = {};
    topicStats.forEach(stat => {
      result[stat.module] = {
        accuracy: stat.accuracy,
        completedQuizzes: stat.completedQuizzes,
        totalQuizzes: moduleQuizCount[stat.module] || 0,
        averageScore: stat.averageScore,
        bestScore: stat.bestScore,
        overallAccuracy: stat.overallAccuracy,
        recentAttempts: stat.recentAttempts
      };
    });

    res.json({
      success: true,
      data: result,
      message: 'Topic statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching topic statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topic statistics',
      error: error.message
    });
  }
});

// NEW: Get detailed quiz history with enhanced filtering
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      module, 
      sortBy = 'completedAt', 
      sortOrder = 'desc',
      minScore,
      maxScore,
      minAccuracy,
      maxAccuracy,
      fromDate,
      toDate
    } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId format'
      });
    }

    // Build query
    const query = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (module) {
      query.module = module;
    }
    
    if (minScore !== undefined) {
      query.score = { $gte: parseInt(minScore) };
    }
    
    if (maxScore !== undefined) {
      query.score = { ...query.score, $lte: parseInt(maxScore) };
    }
    
    if (minAccuracy !== undefined) {
      query.accuracy = { $gte: parseFloat(minAccuracy) };
    }
    
    if (maxAccuracy !== undefined) {
      query.accuracy = { ...query.accuracy, $lte: parseFloat(maxAccuracy) };
    }
    
    if (fromDate || toDate) {
      query.completedAt = {};
      if (fromDate) {
        query.completedAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.completedAt.$lte = new Date(toDate);
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch results with enhanced population
    const results = await QuizResult.find(query)
      .populate({
        path: 'quizId',
        select: 'module chapter questions title description',
        populate: {
          path: 'questions',
          select: 'question options correctAnswer explanation imageUrl solutionImageUrl points difficulty type'
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QuizResult.countDocuments(query);

    // Enhanced response with additional metadata
    const enhancedResults = results.map(result => ({
      ...result.toObject(),
      performance: {
        grade: result.accuracy >= 90 ? 'A' : result.accuracy >= 80 ? 'B' : result.accuracy >= 70 ? 'C' : result.accuracy >= 60 ? 'D' : 'F',
        percentile: Math.round(result.accuracy),
        timeSpent: result.completedAt ? new Date(result.completedAt).getTime() - new Date(result.createdAt).getTime() : null
      }
    }));

    res.json({
      success: true,
      data: enhancedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalResults: total,
        hasNextPage: skip + results.length < total,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        module,
        sortBy,
        sortOrder,
        minScore,
        maxScore,
        minAccuracy,
        maxAccuracy,
        fromDate,
        toDate
      }
    });

  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz history',
      error: error.message
    });
  }
});

// NEW: Get performance trends over time
router.get('/trends/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'month', module } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid userId format'
      });
    }

    // Build match query
    const matchQuery = { userId: new mongoose.Types.ObjectId(userId) };
    if (module) {
      matchQuery.module = module;
    }

    // Define date grouping based on period
    let dateGrouping;
    switch (period) {
      case 'week':
        dateGrouping = {
          year: { $year: '$completedAt' },
          week: { $week: '$completedAt' }
        };
        break;
      case 'month':
        dateGrouping = {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' }
        };
        break;
      case 'day':
        dateGrouping = {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
          day: { $dayOfMonth: '$completedAt' }
        };
        break;
      default:
        dateGrouping = {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' }
        };
    }

    // Aggregate trends data
    const trends = await QuizResult.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: dateGrouping,
          averageScore: { $avg: '$score' },
          averageAccuracy: { $avg: '$accuracy' },
          totalQuizzes: { $sum: 1 },
          totalPoints: { $sum: '$score' },
          bestScore: { $max: '$score' },
          worstScore: { $min: '$score' }
        }
      },
      {
        $project: {
          _id: 0,
          period: '$_id',
          averageScore: { $round: ['$averageScore', 1] },
          averageAccuracy: { $round: ['$averageAccuracy', 1] },
          totalQuizzes: 1,
          totalPoints: 1,
          bestScore: 1,
          worstScore: 1,
          improvement: {
            $subtract: ['$bestScore', '$worstScore']
          }
        }
      },
      { $sort: { 'period.year': 1, 'period.month': 1, 'period.day': 1, 'period.week': 1 } }
    ]);

    res.json({
      success: true,
      data: trends,
      period: period,
      module: module || 'all'
    });

  } catch (error) {
    console.error('Error fetching performance trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance trends',
      error: error.message
    });
  }
});

module.exports = router;