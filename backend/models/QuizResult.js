// models/QuizResult.js

const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  module: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
quizResultSchema.index({ userId: 1, completedAt: -1 });
quizResultSchema.index({ userId: 1, module: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);