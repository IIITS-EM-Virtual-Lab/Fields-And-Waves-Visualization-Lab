const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');
const { clearAuthCookie } = require('../utils/authCookies');

// @desc    Get all active users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update user profile (Self or Admin)
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdmin = Boolean(req.user.isAdmin);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, password } = req.body;
    if (name && name.trim().length >= 2) user.name = name.trim();
    if (password && password.length >= 6) user.password = password;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
});

// @desc    Delete user account (Admin or Self)
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdmin = Boolean(req.user.isAdmin);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this user' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Mark as deleted so it cannot be automatically resurrected
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    if (isSelf) {
      clearAuthCookie(res);
    }

    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Toggle admin status
// @route   PATCH /api/users/:id/toggle-admin
// @access  Private/Admin
router.patch('/:id/toggle-admin', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own admin status' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ 
      message: `User ${user.isAdmin ? 'promoted to' : 'demoted from'} admin`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
