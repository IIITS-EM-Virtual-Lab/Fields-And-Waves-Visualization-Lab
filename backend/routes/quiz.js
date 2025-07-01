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

// ✅ Route definitions
router.get('/module/:moduleName/common', getModuleQuizzes);
router.get('/module/:moduleName/chapter/:chapterName', getChapterQuiz);

router.post('/', auth, admin, createQuiz);
router.put('/:quizId', auth, admin, updateQuiz);
router.delete('/:quizId', auth, admin, deleteQuiz);

// ✅ Upload with multiple fields
router.post(
  '/:quizId/questions',
  auth,
  admin,
  upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
  ]),
  addQuestion
);

router.put(
  '/:quizId/questions/:questionId',
  auth,
  admin,
  upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'solutionImage', maxCount: 1 }
  ]),
  updateQuestion
);

router.delete('/:quizId/questions/:questionId', auth, admin, deleteQuestion);

module.exports = router;
