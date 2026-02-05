const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../utils/emailService');

// @desc    Request password reset
// @route   POST /api/password-reset/request
// @access  Public
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not (security)
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link has been sent.'
      });
    }

    // Check if user is Google user
    if (user.isGoogleUser && !user.password) {
      return res.status(400).json({
        success: false,
        error: 'This account uses Google Sign-In. Please sign in with Google.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token and expiry to user
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'https://www.fwvlab.com'}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendResetPasswordEmail(user.email, resetUrl);
      console.log('✅ Password reset email sent to:', user.email);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      // If email fails, remove token from user
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      console.error('❌ Email sending failed:', emailError);
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
});

// @desc    Reset password
// @route   POST /api/password-reset/reset
// @access  Public
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide token and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Set new password (will be hashed by User model pre-save hook)
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
});

module.exports = router;