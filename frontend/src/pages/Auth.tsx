import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './auth.css';
import loginImg from '../assets/login.svg';
import registerImg from '../assets/register.svg';
import { setCredentials } from '../store/slices/authSlice';
import ChargeButton from '../components/ChargeButton';
import { Button } from '../components/ui/button';
import { FaGoogle } from "react-icons/fa";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [resetButton, setResetButton] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Debug mounting
  useEffect(() => {
    console.log('Auth component mounted');
  }, []);

  // Login refs
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);

  // Signup refs
  const signupNameRef = useRef<HTMLInputElement>(null);
  const signupEmailRef = useRef<HTMLInputElement>(null);
  const signupPasswordRef = useRef<HTMLInputElement>(null);
  const signupConfirmPasswordRef = useRef<HTMLInputElement>(null);

  // OTP refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (showOTP) {
      otpRefs.current[0]?.focus();
    }
  }, [showOTP]);

  const validateName = (name: string): string | undefined => {
    if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    if (!/^[a-zA-Z\s]{3,}$/.test(name)) {
      return 'Name must contain at least 3 alphabets';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateForm = () => {
    const name = signupNameRef.current?.value || '';
    const email = signupEmailRef.current?.value || '';
    const password = signupPasswordRef.current?.value || '';
    const confirmPassword = signupConfirmPasswordRef.current?.value || '';

    const errors: ValidationErrors = {};
    
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = () => {
    validateForm();
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email: loginEmailRef.current?.value,
        password: loginPasswordRef.current?.value,
      }, {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      const user = response.data.data.user;

      dispatch(setCredentials({
        token: response.data.data.token,
        client: {
          name: user.name,
          email: user.email
        }
      }));


      alert(response.data.message);
      navigate('/home');
    } catch (error: any) {
      setResetButton(true);
      setTimeout(() => {
        alert('Something went wrong!');
      }, 1000);
      setTimeout(() => {
        setResetButton(false);
      }, 1000);
    }
  };

  const handleSignupSubmit = async () => {
    validateForm();
    if (!isFormValid) {
      return;
    }

    try {
      // Store signup data
      setSignupData({
        name: signupNameRef.current?.value || '',
        email: signupEmailRef.current?.value || '',
        password: signupPasswordRef.current?.value || ''
      });

      // Initiate signup and request OTP
      const response = await axios.post('http://localhost:5000/api/auth/initiate-signup', {
        name: signupNameRef.current?.value,
        email: signupEmailRef.current?.value,
        password: signupPasswordRef.current?.value,
      }, {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      if (response.data.success) {
        setShowOTP(true);
      } else {
        alert(response.data.message || 'Failed to initiate signup');
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert('Something went wrong!');
      }
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-and-signup', {
        email: signupData.email,
        otp: otpString,
        name: signupData.name,
        password: signupData.password
      });

      if (response.data.success) {
        alert(response.data.message);
        window.location.reload();
      } else {
        alert(response.data.message || 'Verification failed');
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert('Something went wrong!');
      }
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp(['', '', '', '', '', '']);
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/google');
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to initiate Google sign-in');
    }
  };

  return (
    <div className={`auth-container ${isSignUpMode ? 'sign-up-mode' : ''} ${showOTP ? 'otp-mode' : ''}`} style={{ backgroundColor: '#f6f5f7' }}>
      <div className="forms-container">
        <div className="login-signup">
          {/* Sign In Form */}
          <form className="auth-form sign-in-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                ref={loginEmailRef}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                ref={loginPasswordRef}
                required
              />
            </div>
            <ChargeButton onConnect={handleLoginSubmit} buttonText="Login" reset={resetButton} />
            
            {/* Google Sign In Button */}
            <div className="google-signin-container">
              <Button onClick={handleGoogleSignIn}>
                <FaGoogle className="google-icon" />
                <span style={{ marginLeft: '10px' }}>Sign in with Google</span>
              </Button>
            </div>
          </form>

          {/* Sign Up Form */}
          <form className="auth-form sign-up-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Name"
                ref={signupNameRef}
                onChange={handleInputChange}
                required
                className={validationErrors.name ? 'error' : ''}
              />
              {validationErrors.name && (
                <div className="error-message">{validationErrors.name}</div>
              )}
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                ref={signupEmailRef}
                onChange={handleInputChange}
                required
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && (
                <div className="error-message">{validationErrors.email}</div>
              )}
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                ref={signupPasswordRef}
                onChange={handleInputChange}
                required
                className={validationErrors.password ? 'error' : ''}
              />
              {validationErrors.password && (
                <div className="error-message">{validationErrors.password}</div>
              )}
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Confirm Password"
                ref={signupConfirmPasswordRef}
                onChange={handleInputChange}
                required
                className={validationErrors.confirmPassword ? 'error' : ''}
              />
              {validationErrors.confirmPassword && (
                <div className="error-message">{validationErrors.confirmPassword}</div>
              )}
            </div>
            <ChargeButton onConnect={handleSignupSubmit} buttonText="Sign Up" />
          </form>

          {/* OTP Verification Form */}
          <form className="auth-form otp-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="title">Verify Email</h2>
            <p className="otp-subtitle">Enter the 6-digit code sent to {signupData.email}</p>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="otp-input"
                />
              ))}
            </div>
            <div className="otp-buttons">
              <button onClick={handleBack} className="back-button">
                Back
              </button>
              <ChargeButton onConnect={handleOTPSubmit} buttonText="Verify & Connect" />
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <a onClick={() => setIsSignUpMode(true)}>Join us to explore and create amazing virtual experiences!</a>
          </div>
          <img src={loginImg} className="image" alt="login" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <a onClick={() => setIsSignUpMode(false)}>Sign in and continue your journey with us!</a>
          </div>
          <img src={registerImg} className="image" alt="register" />
        </div>
      </div>
    </div>
  );
};

export default Auth; 