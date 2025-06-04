const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPEmail, storeOTP, verifyOTP, removeOTP } = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Initiate Signup (Send OTP)
exports.initiateSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    // Store OTP and user data temporarily
    storeOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        email,
        name,
        password // Note: This is temporary and will be used in final signup
      }
    });

  } catch (error) {
    console.error('Initiate signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in signup process',
      error: error.message
    });
  }
};

// Verify OTP and Complete Signup
exports.verifyAndSignup = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    // Verify OTP
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Remove OTP from cache
    removeOTP(email);


    res.status(201).json({
      success: true,
      message: 'User registered successfully',  
    });

  } catch (error) {
    console.error('Verify and signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: error.message
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

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

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};

// Get Current User
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

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// Google OAuth URL generation
exports.getGoogleAuthURL = async (req, res) => {
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ error: 'Failed to generate Google auth URL' });
  }
};

// Handle Google OAuth callback
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const { email, name, picture } = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        isGoogleUser: true,
        isAdmin: false // Set default admin status
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Redirect to frontend with token and user data
    const frontendUrl = new URL('http://localhost:5173/auth/google/callback');
    frontendUrl.searchParams.set('token', token);
    frontendUrl.searchParams.set('user', JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin // Include isAdmin field
    }));

    res.redirect(frontendUrl.toString());
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect('http://localhost:5173/auth?error=Google authentication failed');
  }
};
