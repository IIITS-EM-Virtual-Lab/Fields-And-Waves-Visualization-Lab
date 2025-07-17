// /src/pages/Signup.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login-signup.css';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

const Signup = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOTP, setShowOTP] = useState(false);
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // OTP refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const dispatch = useDispatch();

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
      const response = await axios.post('http://localhost:5000/api/auth/initiate-signup', { name, email, password });
      if (response.data.success) {
        setSignupData({ name, email, password });
        setShowOTP(true);
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Signup error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (i: number, value: string) => {
    const updated = [...otp];
    updated[i] = value.slice(0, 1);
    setOtp(updated);

    if (value && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return alert('Please enter complete OTP');

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-and-signup', {
        ...signupData,
        otp: otpString
      });

      if (response.data.success) {
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Verification error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/google');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
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

  const isOTPComplete = () => {
    return otp.every(digit => digit.trim().length === 1);
  };

  return (
    <div className="auth-wrapper">
      {!showOTP ? (
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
                      placeholder="Create a password"
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
      ) : (
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

          {/* Right side with OTP form */}
          <div className="auth-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2 className="auth-title">Verify Email</h2>
                <p className="auth-subtitle">Enter the 6-digit code sent to {signupData.email}</p>
              </div>

              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="otp-container">
                  <div className="otp-inputs">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        className="otp-input"
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOTPChange(i, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(i, e)}
                        ref={(el) => (otpRefs.current[i] = el)}
                      />
                    ))}
                  </div>
                </div>

                <div className="otp-buttons">
                  <button
                    className="auth-btn secondary"
                    onClick={() => setShowOTP(false)}
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    className={`auth-btn primary ${(!isOTPComplete() || isLoading) ? 'disabled' : ''}`}
                    onClick={handleVerify}
                    disabled={!isOTPComplete() || isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;