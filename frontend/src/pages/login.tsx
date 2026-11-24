// /src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import {
  setCredentials,
  checkAuth,
  selectIsAuthenticated,
  selectCurrentUser,
} from '../store/slices/authSlice';
import { API_BASE_URL, warmUpServer } from '../config/api';
import './login-signup.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverMessage, setServerMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const from = (location.state as any)?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (currentUser.isAdmin) {
        navigate('/profilepage', { replace: true });
      } else {
        navigate('/userdashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, location]);

  useEffect(() => {
    warmUpServer();

    const urlParams = new URLSearchParams(window.location.search);
    const oauthStatus = urlParams.get('oauth');
    const error = urlParams.get('error');

    if (error) {
      let errorText = 'Google sign-in failed. Please try again.';
      if (error === 'AccountNotFound') {
        errorText = 'No account found with this Google email. Please register on the Sign Up page first.';
      } else if (error === 'AccountDeleted') {
        errorText = 'This account has been deactivated or deleted. Please contact support.';
      } else if (error === 'NoCode') {
        errorText = 'Google authentication was cancelled.';
      }
      setServerMessage({ type: 'error', text: errorText });
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (oauthStatus === 'success') {
      window.history.replaceState({}, '', window.location.pathname);
      setIsLoading(true);
      dispatch(checkAuth())
        .unwrap()
        .then((user) => {
          if (user.isAdmin) {
            navigate('/profilepage');
          } else {
            navigate('/userdashboard');
          }
        })
        .catch(() => {
          setServerMessage({
            type: 'error',
            text: 'Failed to verify session after Google sign-in. Please try again.'
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, navigate]);

  // Validation function
  const validateForm = () => {
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setServerMessage(null);
    setSlowNotice(false);

    const timer = setTimeout(() => {
      setSlowNotice(true);
    }, 2500);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password
        },
        {
          withCredentials: true,
          timeout: 45000,
          validateStatus: (status) => status >= 200 && status < 500
        }
      );

      clearTimeout(timer);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { user } = response.data.data;

      dispatch(
        setCredentials({
          client: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.isAdmin),
            profilePicture: user.profilePicture
          }
        })
      );

      const from = (location.state as any)?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (user.isAdmin) {
        navigate('/profilepage');
      } else {
        navigate('/userdashboard');
      }
    } catch (error: any) {
      clearTimeout(timer);
      console.error('Login Error:', error);
      const msg = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      setServerMessage({ type: 'error', text: msg });
    } finally {
      clearTimeout(timer);
      setIsLoading(false);
      setSlowNotice(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setServerMessage(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/google?action=login`, {
        withCredentials: true,
        timeout: 15000
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setServerMessage({
        type: 'error',
        text: 'Failed to connect to Google Sign-in. Please try again in a moment.'
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const isFormValid = email.trim().length > 0 && password.trim().length >= 6;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !isLoading) {
      handleLogin();
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
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your account</p>
            </div>

            {serverMessage && (
              <div className={`auth-alert ${serverMessage.type}`}>
                {serverMessage.text}
              </div>
            )}

            {isLoading && slowNotice && (
              <div className="auth-alert info">
                Connecting to server... If the server was idle, it may take a few seconds to wake up.
              </div>
            )}

            {/* Login form */}
            <form className="auth-form" onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
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
                  disabled={isLoading}
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
                    placeholder="Enter your password"
                    value={password}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                      if (serverMessage) setServerMessage(null);
                    }}
                    disabled={isLoading}
                    autoComplete="current-password"
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

              <div className="auth-actions">
                <button
                  type="button"
                  className={`auth-btn primary ${(!isFormValid || isLoading) ? 'disabled' : ''}`}
                  onClick={handleLogin}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading && <span className="auth-spinner" />}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>

              <div className="divider">
                <span>or</span>
              </div>

              {/* OAuth buttons */}
              <div className="oauth-buttons">
                <button
                  className="oauth-btn google"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FaGoogle className="google-icon" />
                  Continue with Google
                </button>
              </div>

              <div className="auth-links">
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
                <span className="auth-link-text">
                  Need an account?{' '}
                  <button
                    type="button"
                    className="link-btn primary"
                    onClick={() => navigate('/signup')}
                    disabled={isLoading}
                  >
                    Create Account
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

export default Login;
