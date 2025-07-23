// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authController = require('./controllers/Auth');
const { auth } = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quiz');
const quizResultRoutes = require('./routes/quizResultRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const feedbackRoutes = require("./routes/feedbackRoutes");


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/password-reset', passwordResetRoutes);
app.use("/api/feedback", feedbackRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ Mongo Error:', err));

// Auth Routes
app.post('/api/auth/initiate-signup', authController.initiateSignup);
app.post('/api/auth/verify-and-signup', authController.verifyAndSignup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', auth, authController.getCurrentUser);
app.get('/api/auth/google', authController.getGoogleAuthURL);
app.get('/api/auth/google/callback', authController.handleGoogleCallback);

// App Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quizresult', quizResultRoutes);

// Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});