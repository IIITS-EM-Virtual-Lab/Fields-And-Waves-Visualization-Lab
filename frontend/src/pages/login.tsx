// /src/pages/Login.tsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import './login-signup.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [resetButton, setResetButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Process token from Google Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const isAdmin = urlParams.get('isAdmin');
    const error = urlParams.get('error');
    const userId = urlParams.get('userId')!;

    if (error) {
      alert('Google Sign-in Failed');
      return;
    }

    if (token && name && email) {
      dispatch(setCredentials({
        token,
        client: { 
          name, 
          email, 
          isAdmin: isAdmin === 'true',
          _id: userId, 
        }
      }));
      if (isAdmin === "true") {
        navigate("/profilepage");
      } else {
        navigate("/userdashboard");
      }
    }
  }, []);

  // Validation function
  const validateForm = () => {
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // ✅ Manual Login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('https://fields-and-waves-visualization-lab.onrender.com/api/auth/login', {
        email: emailRef.current?.value,
        password: passwordRef.current?.value
      }, {
        validateStatus: status => status >= 200 && status < 500
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const user = response.data.data.user;
      const token = response.data.data.token;

      dispatch(setCredentials({
        token,
        client: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
      }));

      // 🔐 Save token and user to localStorage so ChapterQuiz can access them
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/home');
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(error.message || 'Login failed');
      setResetButton(true);
      setTimeout(() => setResetButton(false), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Redirect to Google OAuth URL
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('https://fields-and-waves-visualization-lab.onrender.com/api/auth/google');
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert('Google login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const isFormValid = () => {
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    return email && password && email.length > 0 && password.length > 0;
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

            {/* Login form */}
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  ref={emailRef}
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  onChange={() => setErrors({ ...errors, email: '' })}
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
                    ref={passwordRef}
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    onChange={() => setErrors({ ...errors, password: '' })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="auth-actions">
                <button
                  className={`auth-btn primary ${(!isFormValid() || isLoading) ? 'disabled' : ''}`}
                  onClick={handleLogin}
                  disabled={!isFormValid() || resetButton || isLoading}
                >
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
                >
                  Forgot Password?
                </button>
                <span className="auth-link-text">
                  Need an account?{' '}
                  <button
                    type="button"
                    className="link-btn primary"
                    onClick={() => navigate('/signup')}
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