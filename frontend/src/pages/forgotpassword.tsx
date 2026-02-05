import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login-signup.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setError("");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  const handleReset = async () => {
    if (!isValidEmail) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://fields-and-waves-visualization-lab.onrender.com/api/password-reset/request",
        { email },
        { validateStatus: status => status >= 200 && status < 500 }
      );

      if (response.data.success) {
        setEmailSent(true);
      } else {
        setError(response.data.error || "Failed to send reset email");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.response?.data?.error || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidEmail && !isLoading) {
      handleReset();
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
              alt="Password Reset Illustration" 
            />
          </div>
        </div>

        {/* Right side with form */}
        <div className="auth-right">
          <div className="auth-form-container">
            {emailSent ? (
              // Success state
              <div className="auth-success-container">
                <div className="auth-header">
                  <div className="success-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="32" fill="#4CAF50" fillOpacity="0.1"/>
                      <circle cx="32" cy="32" r="24" fill="#4CAF50"/>
                      <path d="M26 32L30 36L38 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="auth-title">Check Your Email</h2>
                  <p className="auth-subtitle">
                    We've sent a password reset link to:
                  </p>
                  <p className="email-sent-to">{email}</p>
                </div>

                <div className="auth-info-box">
                  <p className="info-text">
                    Click the link in the email to reset your password. 
                    The link will expire in 24 hours.
                  </p>
                </div>

                <div className="auth-actions">
                  <button
                    className="auth-btn primary"
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </button>
                  <button
                    className="auth-btn secondary"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                      setIsValidEmail(false);
                    }}
                  >
                    Try Different Email
                  </button>
                </div>

                <div className="auth-links">
                  <p className="auth-link-text">
                    Didn't receive the email?{' '}
                    <button
                      type="button"
                      className="link-btn primary"
                      onClick={() => {
                        setEmailSent(false);
                        handleReset();
                      }}
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // Request form
              <>
                <div className="auth-header">
                  <h2 className="auth-title">Forgot Password?</h2>
                  <p className="auth-subtitle">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your email address"
                      className={`auth-input ${error ? 'error' : ''}`}
                      disabled={isLoading}
                      autoFocus
                    />
                    {error && <span className="error-message">{error}</span>}
                  </div>

                  <div className="auth-actions">
                    <button
                      className={`auth-btn primary ${(!isValidEmail || isLoading) ? 'disabled' : ''}`}
                      onClick={handleReset}
                      disabled={!isValidEmail || isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
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
                    <span className="auth-link-text">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="link-btn primary"
                        onClick={() => navigate('/signup')}
                        disabled={isLoading}
                      >
                        Sign Up
                      </button>
                    </span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;