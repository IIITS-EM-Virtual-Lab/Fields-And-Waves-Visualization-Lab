const https = require('https');
require('dotenv').config();

const getFrontendUrl = () => {
  let frontendUrl = process.env.FRONTEND_URL || 'https://www.fwvlab.com';
  if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
    frontendUrl = `https://${frontendUrl}`;
  }
  return frontendUrl.replace(/\/$/, '');
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

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

const sendSignupOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify your FWV Lab account</h2>
      <p>Use this one-time password to finish creating your FWV Lab account:</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 30px 0; color: #1a202c;">
        ${otp}
      </div>
      <p style="color: #666;">This code will expire in 10 minutes.</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendMailgunEmail({
    to: email,
    subject: 'Your FWV Lab verification code',
    html,
    text: `Your FWV Lab verification code is ${otp}. It expires in 10 minutes.`
  });
};

const sendResetPasswordEmail = async (email, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You requested a password reset for your FWV Lab account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}"
           style="background-color: #4299e1; color: white; padding: 12px 30px;
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="color: #666; word-break: break-all;">${resetLink}</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendMailgunEmail({
    to: email,
    subject: 'Reset your FWV Lab password',
    html,
    text: `Reset your FWV Lab password: ${resetLink}`
  });
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await sendMailgunEmail({
      to: email,
      subject: 'Welcome to FWV Lab!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to FWV Lab, ${name}!</h2>
          <p>Thank you for creating an account with us.</p>
          <p>You can now access all our features and start learning.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${getFrontendUrl()}/login"
               style="background-color: #4299e1; color: white; padding: 12px 30px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>
        </div>
      `,
      text: `Welcome to FWV Lab, ${name}!`
    });
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
};

module.exports = {
  getFrontendUrl,
  sendResetPasswordEmail,
  sendSignupOtpEmail,
  sendWelcomeEmail
};
