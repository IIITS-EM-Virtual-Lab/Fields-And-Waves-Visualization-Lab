const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
