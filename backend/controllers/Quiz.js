const Quiz = require('../models/Quiz');
const { cloudinary } = require('../config/cloudinary');

// Get all quizzes for a module
exports.getModuleQuizzes = async (req, res) => {
  try {
    const { moduleName } = req.params;
    const quizzes = await Quiz.find({ module: moduleName })
      .select('module chapter questions.length');
    
    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching module quizzes',
      error: error.message
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

// Add question to a quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questionData = req.body;

    // If there's an uploaded file, add its URL to the question data
    if (req.file) {
      questionData.imageUrl = req.file.path;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    quiz.questions.push(questionData);
    await quiz.save();

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding question',
      error: error.message
    });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const updateData = req.body;

    // If there's a new uploaded file, add its URL to the update data
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // If there's a new image and the old question had an image, delete the old image from Cloudinary
    if (req.file && quiz.questions[questionIndex].imageUrl) {
      const oldImageUrl = quiz.questions[questionIndex].imageUrl;
      const publicId = oldImageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    quiz.questions[questionIndex] = {
      ...quiz.questions[questionIndex].toObject(),
      ...updateData
    };

    await quiz.save();

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const question = quiz.questions.find(q => q._id.toString() === questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // If the question has an image, delete it from Cloudinary
    if (question.imageUrl) {
      const publicId = question.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
}; 