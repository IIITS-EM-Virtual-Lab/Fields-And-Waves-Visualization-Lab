const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const SignupOtp = require('../models/SignupOtp');
const { sendSignupOtpEmail, sendWelcomeEmail } = require('../utils/emailService');
const { setAuthCookie, clearAuthCookie } = require('../utils/authCookies');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });

const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findUserByEmail = async (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  // Primary: fast B-tree indexed exact match
  let user = await User.findOne({ email: normalized });
  if (!user) {
    // Secondary fallback: case-insensitive regex
    user = await User.findOne({ email: new RegExp(`^${escapeRegex(normalized)}$`, 'i') });
  }
  return user;
};

const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');

const validateSignupInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return 'Please provide name, email, and password';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!/\S+@\S+\.\S+/.test(email.trim())) {
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
    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please sign in instead.'
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    await SignupOtp.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otpHash: hashOtp(otp),
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
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
      message: err.message || 'Failed to send verification code'
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
        message: 'Please provide the 6-digit verification code'
      });
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser && !existingUser.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please sign in instead.'
      });
    }

    const signupOtp = await SignupOtp.findOne({
      email: normalizedEmail,
      expiresAt: { $gt: new Date() }
    });

    if (!signupOtp) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is invalid or has expired. Please request a new code.'
      });
    }

    if (signupOtp.attempts >= 5) {
      await SignupOtp.deleteOne({ _id: signupOtp._id });
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new code.'
      });
    }

    if (signupOtp.otpHash !== hashOtp(otp)) {
      signupOtp.attempts += 1;
      await signupOtp.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.'
      });
    }

    let user;
    if (existingUser && existingUser.isDeleted) {
      // Re-activating a previously deleted account
      existingUser.name = name.trim();
      existingUser.password = password;
      existingUser.isDeleted = false;
      existingUser.deletedAt = undefined;
      existingUser.isGoogleUser = false;
      user = await existingUser.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        isGoogleUser: false
      });
    }

    await SignupOtp.deleteOne({ _id: signupOtp._id });
    console.log('✅ User registered successfully:', user.email);

    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.name).catch((e) =>
      console.warn('Welcome email background error:', e.message)
    );

    // Establish secure session with HttpOnly cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token, req);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: Boolean(user.isAdmin)
        }
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Signup failed',
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = normalizeEmail(email);

    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      user = await User.findOne({
        email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i')
      }).select('+password');
    }

    if (!user || user.isDeleted) {
      console.log('User not found or deleted:', normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.isGoogleUser && !user.password) {
      console.log('Google-only user attempted password login:', normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please click "Continue with Google".'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for:', normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Issue secure HttpOnly cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token, req);
    console.log('✅ Login successful for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: Boolean(user.isAdmin),
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: err.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: err.message
    });
  }
};

exports.getGoogleAuthURL = async (req, res) => {
  try {
    const { action = 'login' } = req.query;

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const statePayload = {
      action: action === 'signup' ? 'signup' : 'login',
      nonce: crypto.randomBytes(16).toString('hex')
    };

    const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      prompt: 'select_account', // Ensure Google always displays account selection
      state
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
  let frontendUrl = process.env.FRONTEND_URL || 'https://www.fwvlab.com';
  if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
    frontendUrl = `https://${frontendUrl}`;
  }
  frontendUrl = frontendUrl.replace(/\/$/, '');

  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=NoCode`);
    }

    let action = 'login';
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
        if (decodedState.action === 'signup') action = 'signup';
      } catch (stateErr) {
        console.warn('Could not parse OAuth state, defaulting action to login');
      }
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

    const { sub, email, name, picture } = response.data;
    const normalizedEmail = normalizeEmail(email);

    // 1. Look for user by Google Provider ID (sub) or verified email
    let user = null;
    if (sub) {
      user = await User.findOne({ googleId: sub });
    }
    if (!user) {
      user = await findUserByEmail(normalizedEmail);
    }

    // 2. Account exists
    if (user) {
      // Check if account was deleted
      if (user.isDeleted) {
        console.log('Deleted user attempted Google login:', normalizedEmail);
        return res.redirect(`${frontendUrl}/login?error=AccountDeleted`);
      }

      // Link googleId if missing
      if (!user.googleId && sub) {
        user.googleId = sub;
        user.isGoogleUser = true;
        if (picture && !user.profilePicture) user.profilePicture = picture;
        await user.save();
      }

      console.log('Existing user logged in via Google:', normalizedEmail);
    } else {
      // 3. User does not exist in application database
      if (action === 'login') {
        // Enforce application policy: do NOT silently register users on login attempt
        console.log('Unregistered Google user attempted to log in:', normalizedEmail);
        return res.redirect(`${frontendUrl}/login?error=AccountNotFound`);
      }

      // Action is signup: create new application user
      user = await User.create({
        name: name || 'Google User',
        email: normalizedEmail,
        googleId: sub,
        profilePicture: picture,
        isGoogleUser: true,
        isAdmin: false
      });
      console.log('New Google user registered:', normalizedEmail);
    }

    // 4. Issue secure HttpOnly cookie - DO NOT expose JWT in URL query parameters!
    const token = generateToken(user._id);
    setAuthCookie(res, token, req);

    console.log('OAuth successful, redirecting to frontend callback');
    res.redirect(`${frontendUrl}/login?oauth=success`);
  } catch (err) {
    console.error('Google auth error:', err);
    res.redirect(`${frontendUrl}/login?error=GoogleAuthFailed`);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is populated by auth middleware from verified session
    const user = await User.findById(req.user.id || req.user._id).select('-password');

    if (!user || user.isDeleted) {
      clearAuthCookie(res);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
        profilePicture: user.profilePicture
      }
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
