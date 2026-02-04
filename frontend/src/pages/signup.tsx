// /src/pages/Signup.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login-signup.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmRef.current?.value || '';
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    try {
      const response = await axios.post(
        'https://fields-and-waves-visualization-lab.onrender.com/api/auth/signup',
        { name, email, password },
        { validateStatus: status => status >= 200 && status < 500 }
      );

      if (response.data.success) {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        alert(response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await axios.get('https://fields-and-waves-visualization-lab.onrender.com/api/auth/google');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Google signup error:', err);
      alert('Google signup failed');
    }
  };

  const isFormValid = () => {
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    const confirmPassword = confirmRef.current?.value?.trim();
    return name && email && password && confirmPassword && 
           name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0;
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
              <p className="auth-subtitle">Join us to get started</p>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  ref={nameRef}
                  className={`auth-input ${errors.name ? 'error' : ''}`}
                  onChange={() => setErrors({ ...errors, name: '' })}
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
                    placeholder="Create a password (min 6 characters)"
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

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    ref={confirmRef}
                    className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                    onChange={() => setErrors({ ...errors, confirmPassword: '' })}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="auth-actions">
                <button
                  className={`auth-btn primary ${(!isFormValid() || isLoading) ? 'disabled' : ''}`}
                  onClick={handleSignup}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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