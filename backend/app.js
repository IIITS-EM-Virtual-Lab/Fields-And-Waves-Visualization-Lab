const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authController = require('./controllers/Auth');
const auth = require('./middleware/auth');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Mongo Error:', err));

// Routes
app.post('/api/auth/initiate-signup', authController.initiateSignup);
app.post('/api/auth/verify-and-signup', authController.verifyAndSignup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', auth, authController.getCurrentUser);
app.get('/api/auth/google', authController.getGoogleAuthURL);
app.get('/api/auth/google/callback', authController.handleGoogleCallback);

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
