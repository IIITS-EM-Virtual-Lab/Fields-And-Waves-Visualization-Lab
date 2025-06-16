const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: true },
  profilePicture: String,
  isGoogleUser: Boolean
});

module.exports = mongoose.model('User', userSchema);
