const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP,
  removeOTP
} = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });

// Initiate Signup
exports.initiateSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });

    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    storeOTP(email, JSON.stringify({ name, email, password, otp }));

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('Signup error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Signup error', error: err.message });
  }
};

// Verify OTP & Complete Signup
exports.verifyAndSignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const data = verifyOTP(email, otp);
    if (!data)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid OTP' });

    const { name, password } = JSON.parse(data);
    const user = await User.create({ name, email, password });

    removeOTP(email);
    res
      .status(201)
      .json({ success: true, message: 'Signup complete' });
  } catch (err) {
    console.error('Verification error:', err);
    res
      .status(500)
      .json({
        success: false,
        message: 'Verification failed',
        error: err.message
      });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login request for:", email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.password) {
      console.log("⚠️ Google user tried to login with password");
      return res.status(400).json({
        success: false,
        message: 'This account was created using Google. Please sign in with Google.'
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Invalid password");
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(user._id);
    console.log("✅ Login successful for:", user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (err) {
    console.error("🔥 Login backend error:", err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

// Google OAuth - Get URL
exports.getGoogleAuthURL = async (req, res) => {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email']
  });
  res.status(200).json({ url });
};

// Google OAuth - Callback
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const response = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });
    const { email, name, picture } = response.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        profilePicture: picture,
        isGoogleUser: true,
        isAdmin: false // Set default admin status
      });
    }

    const token = generateToken(user._id);

    // Redirect to frontend with token and user data
    const frontendUrl = new URL('http://localhost:5173/auth/google/callback');
    frontendUrl.searchParams.set('token', token);
    frontendUrl.searchParams.set('user', JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    }));

    res.redirect(redirect.toString());
  } catch (err) {
    console.error('Google auth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=GoogleAuthFailed`);
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Fetch user error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Fetch failed', error: err.message });
  }
};
