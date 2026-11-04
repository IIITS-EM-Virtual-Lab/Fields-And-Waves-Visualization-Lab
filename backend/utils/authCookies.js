// backend/utils/authCookies.js

const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = (req) => {
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction;

  return {
    httpOnly: true, 
    secure,
    sameSite,
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };
};

const getClearCookieOptions = () => {
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE !== undefined
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/'
  };
};


const setAuthCookie = (res, token, req) => {
  res.cookie('token', token, getCookieOptions(req));
};

const clearAuthCookie = (res) => {
  res.clearCookie('token', getClearCookieOptions());
};

const extractToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.signedCookies && req.signedCookies.token) {
    return req.signedCookies.token;
  }
  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

module.exports = {
  getCookieOptions,
  getClearCookieOptions,
  setAuthCookie,
  clearAuthCookie,
  extractToken
};

