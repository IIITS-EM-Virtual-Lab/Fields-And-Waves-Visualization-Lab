const https = require('https');
const nodemailer = require('nodemailer');
require('dotenv').config();

const getFrontendUrl = () => {
  let frontendUrl = process.env.FRONTEND_URL || 'https://www.fwvlab.com';
  if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
    frontendUrl = `https://${frontendUrl}`;
  }
  return frontendUrl.replace(/\/$/, '');
};

let mailTransporter = null;

const getTransporter = () => {
  if (!mailTransporter && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
    });
  }
  return mailTransporter;
};

const sendMailgunEmail = ({ to, subject, html, text }) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const baseUrl = process.env.MAILGUN_BASE_URL || 'api.mailgun.net';
  const fromName = process.env.MAILGUN_FROM_NAME || 'FWV Lab';
  const fromEmail = process.env.MAILGUN_FROM_EMAIL || `no-reply@${domain}`;

  if (!apiKey || !domain) {
    throw new Error('Mailgun is not configured. Set MAILGUN_API_KEY and MAILGUN_DOMAIN.');
  }

  const payload = new URLSearchParams({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    text: text || subject
  }).toString();

  const options = {
    hostname: baseUrl.replace(/^https?:\/\//, ''),
    path: `/v3/${domain}/messages`,
    method: 'POST',
    auth: `api:${apiKey}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseBody);
          return;
        }
        reject(new Error(`Mailgun request failed (${res.statusCode}): ${responseBody}`));
      });
    });

    req.setTimeout(8000, () => {
      req.destroy(new Error('Mailgun request timed out after 8 seconds'));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    try {
      await sendMailgunEmail({ to, subject, html, text });
      console.log('✅ Email sent via Mailgun to:', to);
      return true;
    } catch (mailgunErr) {
      console.warn('⚠️ Mailgun failed, attempting fallback to Nodemailer (Gmail):', mailgunErr.message);
    }
  }
  
  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.EMAIL_USER;
      await transporter.sendMail({
        from: `"FWV Lab" <${fromAddress}>`,
        to,
        subject,
        html,
        text: text || subject
      });
      console.log('✅ Email sent via Nodemailer (Gmail) to:', to);
      return true;
    } catch (smtpErr) {
      console.error('❌ Nodemailer failed:', smtpErr.message);
      throw new Error(`Email sending failed: ${smtpErr.message}`);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️ [DEV EMAIL NOTICE] No email provider configured. Target: ${to}, Subject: ${subject}`);
    if (text) console.warn(`Content: ${text}`);
    return true;
  }

  throw new Error('No email provider configured. Please set EMAIL_USER & EMAIL_PASSWORD or Mailgun credentials.');
};

const sendSignupOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #1a202c; margin-bottom: 8px;">Verify your FWV Lab account</h2>
      <p style="color: #4a5568; font-size: 15px;">Use this one-time password to complete creating your FWV Lab account:</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 24px 0; color: #2b6cb0; text-align: center; background: #edf2f7; padding: 16px; border-radius: 6px;">
        ${otp}
      </div>
      <p style="color: #718096; font-size: 14px;">This code will expire in 10 minutes.</p>
      <p style="color: #a0aec0; font-size: 12px; margin-top: 24px; border-top: 1px solid #edf2f7; padding-top: 12px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Your FWV Lab verification code',
    html,
    text: `Your FWV Lab verification code is ${otp}. It expires in 10 minutes.`
  });
};

const sendResetPasswordEmail = async (email, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #1a202c;">Password Reset Request</h2>
      <p style="color: #4a5568;">You requested a password reset for your FWV Lab account.</p>
      <p style="color: #4a5568;">Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetLink}"
           style="background-color: #3182ce; color: white; padding: 12px 28px;
                  text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #718096; font-size: 13px;">Or copy and paste this link into your browser:</p>
      <p style="color: #3182ce; word-break: break-all; font-size: 13px;">${resetLink}</p>
      <p style="color: #a0aec0; font-size: 12px; margin-top: 24px; border-top: 1px solid #edf2f7; padding-top: 12px;">
        This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset your FWV Lab password',
    html,
    text: `Reset your FWV Lab password: ${resetLink}`
  });
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to FWV Lab!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #1a202c;">Welcome to FWV Lab, ${name}! 🎉</h2>
          <p style="color: #4a5568;">Thank you for creating an account with us.</p>
          <p style="color: #4a5568;">You can now access all our interactive simulations, visualizations, and quizzes.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${getFrontendUrl()}/login"
               style="background-color: #3182ce; color: white; padding: 12px 28px;
                      text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Get Started
            </a>
          </div>
        </div>
      `,
      text: `Welcome to FWV Lab, ${name}!`
    });
    return true;
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return false;
  }
};

module.exports = {
  getFrontendUrl,
  sendResetPasswordEmail,
  sendSignupOtpEmail,
  sendWelcomeEmail
};
