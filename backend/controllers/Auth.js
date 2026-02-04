const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });

// ✅ SIMPLE SIGNUP - No OTP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      isGoogleUser: false
    });

    console.log('✅ User created:', user.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please login.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: err.message
    });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login request for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if Google user
    if (user.isGoogleUser && !user.password) {
      console.log('⚠️ Google user tried to login with password');
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please sign in with Google.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('✅ Login successful for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      }
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message
    });
  }
};

// ✅ GOOGLE OAUTH - Get URL
exports.getGoogleAuthURL = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Google URL error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Google auth URL'
    });
  }
};

// ✅ GOOGLE OAUTH - Callback
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=NoCode`);
    }

    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Get tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const response = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const { email, name, picture } = response.data;

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new Google user
      user = await User.create({
        name,
        email,
        profilePicture: picture,
        isGoogleUser: true,
        isAdmin: false
      });
      console.log('✅ New Google user created:', email);
    } else {
      console.log('✅ Existing user logged in via Google:', email);
    }

    // Generate token
    const token = generateToken(user._id);

    // Redirect to frontend with user data
    const frontendUrl = new URL(`${process.env.FRONTEND_URL}/login`);
    frontendUrl.searchParams.set('token', token);
    frontendUrl.searchParams.set('name', user.name);
    frontendUrl.searchParams.set('email', user.email);
    frontendUrl.searchParams.set('isAdmin', user.isAdmin.toString());
    frontendUrl.searchParams.set('userId', user._id.toString());

    res.redirect(frontendUrl.toString());
  } catch (err) {
    console.error('❌ Google auth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=GoogleAuthFailed`);
  }
};

// ✅ GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: err.message
    });
  }
};