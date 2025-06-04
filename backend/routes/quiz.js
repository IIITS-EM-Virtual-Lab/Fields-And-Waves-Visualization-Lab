const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  getModuleQuizzes,
  getChapterQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/Quiz');

// Public routes
router.get('/module/:moduleName', getModuleQuizzes);
router.get('/module/:moduleName/chapter/:chapterName', getChapterQuiz);

// Admin only routes
router.post('/', protect, authorize(), createQuiz);
router.put('/:quizId', protect, authorize(), updateQuiz);
router.delete('/:quizId', protect, authorize(), deleteQuiz);
router.post('/:quizId/questions', protect, authorize(), upload.single('image'), addQuestion);
router.put('/:quizId/questions/:questionId', protect, authorize(), upload.single('image'), updateQuestion);
router.delete('/:quizId/questions/:questionId', protect, authorize(), deleteQuestion);

module.exports = router; 