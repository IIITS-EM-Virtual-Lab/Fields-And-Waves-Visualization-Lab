// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authController = require('./controllers/Auth');
const { auth } = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quiz');
const quizResultRoutes = require('./routes/quizResultRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();

// Allowed Origins for CORS and CSRF Protection
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://www.fwvlab.com',
  'https://fwvlab.com',
  'https://fields-and-waves-visualization-lab.onrender.com',
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''));

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Direct/same-origin/server-to-server
  const normalized = origin.replace(/\/$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  if (allowedOrigins.includes(`https://${normalized}`)) return true;
  if (allowedOrigins.includes(`http://${normalized}`)) return true;
  if (normalized.endsWith('.fwvlab.com')) return true;
  if (normalized.endsWith('.onrender.com')) return true;
  return false;
};

// CORS Middleware with credentials
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, origin || true);
      } else {
        console.warn('Blocked by CORS origin validation:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'CSRF-Token']
  })
);

app.use(cookieParser());
app.use(express.json());

// CSRF Origin verification middleware for state-changing requests
app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
  if (origin && !isOriginAllowed(origin)) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed: Invalid request origin'
    });
  }
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ Mongo Error:', err));

// Auth Routes
app.post('/api/auth/signup/send-otp', authController.sendSignupOtp);
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', auth, authController.getCurrentUser);
app.get('/api/auth/google', authController.getGoogleAuthURL);
app.get('/api/auth/google/callback', authController.handleGoogleCallback);

// Other Routes
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quizresult', quizResultRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error Middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Not allowed by CORS'
    });
  }
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
