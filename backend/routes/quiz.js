const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
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
router.post('/', auth, admin, createQuiz);
router.put('/:quizId', auth, admin, updateQuiz);
router.delete('/:quizId', auth, admin, deleteQuiz);
router.post('/:quizId/questions', auth, admin, upload.single('image'), addQuestion);
router.put('/:quizId/questions/:questionId', auth, admin, upload.single('image'), updateQuestion);
router.delete('/:quizId/questions/:questionId', auth, admin, deleteQuestion);

module.exports = router; 