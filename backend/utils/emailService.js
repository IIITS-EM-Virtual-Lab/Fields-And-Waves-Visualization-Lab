const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const crypto = require('crypto');
require('dotenv').config();

// Cache to store OTPs with 10 minutes expiry
const otpCache = new NodeCache({ stdTTL: 600 });

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 6 digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <h1>Email Verification</h1>
      <p>Your OTP for email verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Store OTP in cache
const storeOTP = (email, otp) => {
  otpCache.set(email, otp);
};

// Verify OTP
const verifyOTP = (email, otp) => {
  const storedOTP = otpCache.get(email);
  if (!storedOTP) return false;
  return storedOTP === otp;
};

// Remove OTP from cache after successful verification
const removeOTP = (email) => {
  otpCache.del(email);
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP,
  removeOTP
}; 