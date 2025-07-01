const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MCQ', 'BLANK'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: function() {
      return this.type === 'MCQ';
    }
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string or array of strings
    required: true
  },
  explanation: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 1
  },
  imageUrl: {
    type: String,
    required: false
  },
  solutionImageUrl: {           
    type: String,
    required: false
  }
});

const quizSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
  },
  chapter: {
    type: String,
    required: false,
    default:''
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for efficient querying
quizSchema.index({ module: 1, chapter: 1 });
quizSchema.index({ 'questions.difficulty': 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 