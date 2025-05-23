import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './auth.css';
import loginImg from '../assets/login.svg';
import registerImg from '../assets/register.svg';
import { setCredentials } from '../store/slices/authSlice';
import ChargeButton from '../components/ChargeButton';

const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });
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

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email: loginEmailRef.current?.value,
        password: loginPasswordRef.current?.value,
      });

      dispatch(setCredentials({
        token: response.data.token,
        client: response.data.client
      }));

      alert(response.data.message);
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert('Something went wrong!');
      }
    }
  };

  const handleSignupSubmit = async () => {
    if (signupPasswordRef.current?.value !== signupConfirmPasswordRef.current?.value) {
      alert("Passwords don't match!");
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
        dispatch(setCredentials({
          token: response.data.token,
          client: response.data.client
        }));
        alert('Registration successful!');
        navigate('/');
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
            <ChargeButton onConnect={handleLoginSubmit} buttonText="Login" />
          </form>

          {/* Sign Up Form */}
          <form className="auth-form sign-up-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <input
                type="text"
                placeholder="Name"
                ref={signupNameRef}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="email"
                placeholder="Email"
                ref={signupEmailRef}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                ref={signupPasswordRef}
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                placeholder="Confirm Password"
                ref={signupConfirmPasswordRef}
                required
              />
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