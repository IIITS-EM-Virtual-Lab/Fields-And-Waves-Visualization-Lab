const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authController = require('./controllers/Auth');
const auth = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quiz');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/auth/initiate-signup', authController.initiateSignup);
app.post('/api/auth/verify-and-signup', authController.verifyAndSignup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', auth.auth, authController.getCurrentUser);
app.get('/api/auth/google', authController.getGoogleAuthURL);
app.get('/api/auth/google/callback', authController.handleGoogleCallback);

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
