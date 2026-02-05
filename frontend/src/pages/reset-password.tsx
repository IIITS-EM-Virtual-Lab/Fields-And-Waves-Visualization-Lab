import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./login-signup.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [tokenError, setTokenError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let isValid = true;

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!token) return;

    setIsLoading(true);
    setTokenError("");

    try {
      const response = await axios.post(
        "https://fields-and-waves-visualization-lab.onrender.com/api/password-reset/reset",
        { token, newPassword: password },
        { validateStatus: status => status >= 200 && status < 500 }
      );

      if (response.data.success) {
        setResetSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setTokenError(response.data.error || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setTokenError(error.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password && confirmPassword && !isLoading) {
      handleSubmit();
    }
  };

  const isFormValid = () => {
    return password.length >= 6 && password === confirmPassword;
  };

  if (tokenError && !token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-illustration">
              <img 
                src="/college project-rafiki.png" 
                alt="Error Illustration" 
              />
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <div className="error-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#f44336" fillOpacity="0.1"/>
                    <circle cx="32" cy="32" r="24" fill="#f44336"/>
                    <path d="M32 24v16M32 44v.01" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 className="auth-title">Invalid Reset Link</h2>
                <p className="auth-subtitle">{tokenError}</p>
              </div>

              <div className="auth-actions">
                <button
                  className="auth-btn primary"
                  onClick={() => navigate('/forgot-password')}
                >
                  Request New Reset Link
                </button>
                <button
                  className="auth-btn secondary"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-left">
            <div className="auth-illustration">
              <img 
                src="/college project-rafiki.png" 
                alt="Success Illustration" 
              />
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <div className="success-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="#4CAF50" fillOpacity="0.1"/>
                    <circle cx="32" cy="32" r="24" fill="#4CAF50"/>
                    <path d="M26 32L30 36L38 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="auth-title">Password Reset Successful!</h2>
                <p className="auth-subtitle">
                  Your password has been successfully reset.
                  Redirecting to login...
                </p>
              </div>

              <div className="auth-actions">
                <button
                  className="auth-btn primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Left side with illustration */}
        <div className="auth-left">
          <div className="auth-illustration">
            <img 
              src="/college project-rafiki.png" 
              alt="Reset Password Illustration" 
            />
          </div>
        </div>

        {/* Right side with form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Reset Password</h2>
              <p className="auth-subtitle">
                Enter your new password below
              </p>
            </div>

            {tokenError && (
              <div className="error-banner">
                <p>{tokenError}</p>
              </div>
            )}

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  New Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new password (min 6 characters)"
                    className={`auth-input ${errors.password ? 'error' : ''}`}
                    disabled={isLoading}
                    autoFocus
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
                  Confirm New Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirm your new password"
                    className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                    disabled={isLoading}
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

              <div className="password-requirements">
                <p className="requirements-title">Password Requirements:</p>
                <ul className="requirements-list">
                  <li className={password.length >= 6 ? 'valid' : ''}>
                    At least 6 characters
                  </li>
                  <li className={password === confirmPassword && password ? 'valid' : ''}>
                    Passwords match
                  </li>
                </ul>
              </div>

              <div className="auth-actions">
                <button
                  className={`auth-btn primary ${(!isFormValid() || isLoading) ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>

              <div className="auth-links">
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;