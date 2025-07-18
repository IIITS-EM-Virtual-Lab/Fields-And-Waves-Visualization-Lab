const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Request reset
router.post('/request', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'No account with that email' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 24 * 60 * 60 * 1000;

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  const link = `https://www.fwvlab.com/reset-password?token=${token}`;
  await sendResetPasswordEmail(email, link);

  res.json({ message: 'Reset link sent' });
});

// Reset password
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ error: 'Token expired or invalid' });

  user.password = newPassword; // Don't hash here
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save(); // hashing handled by pre-save hook

  res.json({ message: 'Password has been reset' });
});


module.exports = router;
