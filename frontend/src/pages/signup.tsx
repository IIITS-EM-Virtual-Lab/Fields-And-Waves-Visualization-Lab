// /src/pages/Signup.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { AppDispatch } from '../store/store';
import { API_BASE_URL, warmUpServer } from '../config/api';
import './login-signup.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    warmUpServer();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Validation function
  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', otp: '' };

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setServerMessage(null);
    setSlowNotice(false);

    const timer = setTimeout(() => setSlowNotice(true), 2500);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup/send-otp`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        },
        {
          timeout: 45000,
          validateStatus: (status) => status >= 200 && status < 500
        }
      );

      clearTimeout(timer);

      if (response.data.success) {
        setOtpSent(true);
        setOtp('');
        setResendCooldown(45);
        setErrors((prev) => ({ ...prev, otp: '' }));
        setServerMessage({
          type: 'success',
          text: `Verification code sent to ${email.trim()}. Please enter the 6-digit code below.`
        });
      } else {
        setServerMessage({
          type: 'error',
          text: response.data.message || 'Failed to send verification code'
        });
      }
    } catch (error: any) {
      clearTimeout(timer);
      console.error('Signup OTP error:', error);
      const msg = error.response?.data?.message || error.message || 'Could not send verification code. Please try again.';
      setServerMessage({ type: 'error', text: msg });
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
      setSlowNotice(false);
    }
  };

  const handleSignup = async () => {
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter the 6-digit verification code' }));
      return;
    }

    setIsLoading(true);
    setServerMessage(null);
    setSlowNotice(false);

    const timer = setTimeout(() => setSlowNotice(true), 2500);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          otp: otp.trim()
        },
        {
          withCredentials: true,
          timeout: 45000,
          validateStatus: (status) => status >= 200 && status < 500
        }
      );

      clearTimeout(timer);

      if (response.data.success) {
        setServerMessage({
          type: 'success',
          text: 'Account created successfully! Logging you in...'
        });

        if (response.data.data?.user) {
          dispatch(
            setCredentials({
              client: response.data.data.user
            })
          );
          setTimeout(() => navigate('/userdashboard'), 1200);
        } else {
          setTimeout(() => navigate('/login'), 1500);
        }
      } else {
        setServerMessage({
          type: 'error',
          text: response.data.message || 'Signup failed'
        });
      }
    } catch (error: any) {
      clearTimeout(timer);
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || error.message || 'Signup error. Please try again.';
      setServerMessage({ type: 'error', text: msg });
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
      setSlowNotice(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setServerMessage(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/google?action=signup`, { withCredentials: true, timeout: 15000 });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setServerMessage({
        type: 'error',
        text: 'Failed to connect to Google sign-up. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const handleEditDetails = () => {
    setOtpSent(false);
    setOtp('');
    setServerMessage(null);
    setErrors((prev) => ({ ...prev, otp: '' }));
  };

  const isFormValid =
    name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email.trim()) &&
    password.trim().length >= 6 &&
    password === confirmPassword;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (!otpSent && isFormValid) {
        handleSendOtp();
      } else if (otpSent && otp.trim().length === 6) {
        handleSignup();
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left side with illustration */}
        <div className="auth-left">
          <div className="auth-illustration">
            <img 
              src="/college project-rafiki.png" 
              alt="College Learning Illustration" 
            />
          </div>
        </div>

        {/* Right side with form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join us to explore fields & waves simulations</p>
            </div>

            {/* Server Message Alert */}
            {serverMessage && (
              <div className={`auth-alert ${serverMessage.type}`}>
                {serverMessage.text}
              </div>
            )}

            {/* Slow connection hint */}
            {isLoading && slowNotice && (
              <div className="auth-alert info">
                Connecting to server... If the server was idle, it may take a few seconds to wake up.
              </div>
            )}

            <form className="auth-form" onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  className={`auth-input ${errors.name ? 'error' : ''}`}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                    if (serverMessage) setServerMessage(null);
                  }}
                  disabled={otpSent || isLoading}
                  autoComplete="name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                    if (serverMessage) setServerMessage(null);
                  }}
                  disabled={otpSent || isLoading}
                  autoComplete="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                      if (serverMessage) setServerMessage(null);
                    }}
                    disabled={otpSent || isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      if (serverMessage) setServerMessage(null);
                    }}
                    disabled={otpSent || isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {otpSent && (
                <div className="otp-container">
                  <div className="form-group">
                    <label htmlFor="signupOtp" className="form-label">
                      6-Digit Verification Code <span className="required">*</span>
                    </label>
                    <input
                      id="signupOtp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (errors.otp) setErrors({ ...errors, otp: '' });
                      }}
                      placeholder="• • • • • •"
                      className={`auth-input otp-code-input ${errors.otp ? 'error' : ''}`}
                      disabled={isLoading}
                      autoFocus
                    />
                    {errors.otp && <span className="error-message">{errors.otp}</span>}
                  </div>

                  <div className="otp-buttons">
                    <button
                      type="button"
                      className="link-btn primary"
                      onClick={handleSendOtp}
                      disabled={isLoading || resendCooldown > 0}
                    >
                      {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                    </button>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={handleEditDetails}
                      disabled={isLoading}
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              )}

              <div className="auth-actions">
                <button
                  type="button"
                  className={`auth-btn primary ${(isLoading || (!otpSent && !isFormValid) || (otpSent && otp.trim().length !== 6)) ? 'disabled' : ''}`}
                  onClick={handleSignup}
                  disabled={isLoading || (!otpSent && !isFormValid) || (otpSent && otp.trim().length !== 6)}
                >
                  {isLoading && <span className="auth-spinner" />}
                  {isLoading
                    ? (otpSent ? 'Verifying...' : 'Sending Code...')
                    : (otpSent ? 'Verify & Create Account' : 'Send Verification Code')}
                </button>
              </div>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="oauth-buttons">
                <button
                  className="oauth-btn google"
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <FaGoogle className="google-icon" />
                  Continue with Google
                </button>
              </div>

              <div className="auth-links">
                <span className="auth-link-text">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="link-btn primary"
                    onClick={() => navigate('/login')}
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
