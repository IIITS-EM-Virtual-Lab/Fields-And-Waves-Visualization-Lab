const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { extractToken, clearAuthCookie } = require('../utils/authCookies');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

const auth = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session or token found.'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || user.isDeleted) {
        clearAuthCookie(res);
        return res.status(401).json({
          success: false,
          message: 'Account not found or has been deactivated.'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }
  } catch (error) {
    console.error('General auth error:', error.message);
    clearAuthCookie(res);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Protect middleware alias
const protect = auth;

// Authorize roles
const authorize = () => {
  return (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required'
      });
    }
  };
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required'
    });
  }
};

module.exports = { auth, protect, authorize, admin };
