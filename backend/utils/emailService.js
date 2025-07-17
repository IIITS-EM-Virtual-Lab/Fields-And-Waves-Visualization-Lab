const NodeCache = require('node-cache');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const otpCache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// 1. Generate a random 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// 2. Store OTP with user data (email => {otp, name, password})
const storeOTP = (email, data) => {
  otpCache.set(email, data);
};

// 3. Verify OTP
const verifyOTP = (email, otp) => {
  const stored = otpCache.get(email);
  if (!stored) return false;

  const parsed = JSON.parse(stored);
  if (parsed.email !== email) return false;
  if (parsed.otp !== otp) return false;

  return stored; // this gets parsed later in Auth.js
};


// 4. Remove OTP after use
const removeOTP = (email) => {
  otpCache.del(email);
};

// 5. Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"VE Lab" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your VE Lab OTP Code',
    html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"VE Lab" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your VE Lab password',
    html: `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid for 24 hours. If you didn’t request this, you can ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// 6. Export everything
module.exports = {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP,
  removeOTP,
  sendResetPasswordEmail
};
