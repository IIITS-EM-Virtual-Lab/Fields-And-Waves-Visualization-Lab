const Quiz = require('../models/Quiz');
const { v2: cloudinary } = require('cloudinary');
const uploader = cloudinary.uploader;


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

exports.addQuestion = async (req, res) => {
  try {
    console.log('📦 Incoming BODY:', req.body);
    console.log('🖼 Incoming FILES:', req.files);
    console.log('🧾 Params:', req.params);

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
      console.error('❌ JSON Parse Error:', parseErr);
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
    console.error('❌ Final Catch Error:', err);
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

    // ✅ Replace existing images if new ones are uploaded
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
    console.error('Error updating question:', error);
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
