const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./controllers/Auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Mongo Error:', err));

app.post('/api/auth/initiate-signup', authRoutes.initiateSignup);
app.post('/api/auth/verify-and-signup', authRoutes.verifyAndSignup);
app.post('/api/auth/login', authRoutes.login);
app.get('/api/auth/google', authRoutes.getGoogleAuthURL);
app.get('/api/auth/google/callback', authRoutes.handleGoogleCallback);
app.get('/api/auth/me', authMiddleware, authRoutes.getCurrentUser);

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
