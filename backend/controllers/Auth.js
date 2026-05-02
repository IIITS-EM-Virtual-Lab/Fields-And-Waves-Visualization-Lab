const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const SignupOtp = require('../models/SignupOtp');
const { sendSignupOtpEmail } = require('../utils/emailService');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });

const normalizeEmail = (email) => email.trim().toLowerCase();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findUserByEmail = (email) =>
  User.findOne({ email: new RegExp(`^${escapeRegex(normalizeEmail(email))}$`, 'i') });

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex');

const validateSignupInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return 'Please provide name, email, and password';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Please provide a valid email address';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
};

exports.sendSignupOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validationError = validateSignupInput({ name, email, password });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await SignupOtp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otpHash: hashOtp(otp),
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendSignupOtpEmail(normalizedEmail, otp);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (err) {
    console.error('Signup OTP error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code',
      error: err.message
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const validationError = validateSignupInput({ name, email, password });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the verification code'
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const signupOtp = await SignupOtp.findOne({
      email: normalizedEmail,
      expiresAt: { $gt: new Date() }
    });

    if (!signupOtp) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is invalid or expired'
      });
    }

    if (signupOtp.attempts >= 5) {
      await SignupOtp.deleteOne({ _id: signupOtp._id });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new code.'
      });
    }

    if (signupOtp.otpHash !== hashOtp(otp.toString().trim())) {
      signupOtp.attempts += 1;
      await signupOtp.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      isGoogleUser: false
    });

    await SignupOtp.deleteOne({ _id: signupOtp._id });
    console.log('User created:', user.email);

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
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await findUserByEmail(email).select('+password');
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.isGoogleUser && !user.password) {
      console.log('Google user tried to login with password');
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please sign in with Google.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);
    console.log('Login successful for:', user.email);

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
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message
    });
  }
};

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

exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    let frontendUrl = process.env.FRONTEND_URL || 'https://www.fwvlab.com';
    if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
      frontendUrl = `https://${frontendUrl}`;
    }

    console.log('Frontend URL:', frontendUrl);

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=NoCode`);
    }

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
        isAdmin: false
      });
      console.log('New Google user created:', email);
    } else {
      console.log('Existing user logged in via Google:', email);
    }

    const token = generateToken(user._id);
    const redirectUrl = `${frontendUrl}/login?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&isAdmin=${user.isAdmin}&userId=${user._id}`;

    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('Google auth error:', err);

    let frontendUrl = process.env.FRONTEND_URL || 'https://www.fwvlab.com';
    if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
      frontendUrl = `https://${frontendUrl}`;
    }

    res.redirect(`${frontendUrl}/login?error=GoogleAuthFailed`);
  }
};

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
