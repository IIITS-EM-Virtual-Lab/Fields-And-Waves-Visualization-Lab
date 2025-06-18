const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) return res.status(401).json({ success: false, message: 'No token' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      
      // Add user from payload
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add user to request
      req.user = user;
      
      next();
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError.message);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } catch (error) {
    console.log("General auth error:", error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Add user to request object
      req.user = user;
      console.log('User added to request:', {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      });
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in authentication',
      error: error.message
    });
  }
};

// Authorize roles
const authorize = () => {
  return (req, res, next) => {
    // Check if user is admin
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  };
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

module.exports = { auth, protect, authorize, admin }; 