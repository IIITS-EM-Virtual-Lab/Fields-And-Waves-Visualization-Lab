const QuizResult = require("../models/QuizResult");

// Save a new quiz result
exports.submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, score, totalQuestions, correctAnswers } = req.body;
    const newResult = new QuizResult({
      userId,
      quizId,
      score,
      totalQuestions,
      correctAnswers,
    });
    await newResult.save();
    res.status(201).json({ message: "Quiz submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId });

    const totalQuizzes = results.length;
    const totalPoints = results.reduce((acc, r) => acc + r.score, 0);
    const totalCorrect = results.reduce((acc, r) => acc + r.correctAnswers, 0);
    const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestions, 0);
    const accuracy = totalQuestions ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;

    res.json({ totalPoints, totalQuizzes, accuracy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
