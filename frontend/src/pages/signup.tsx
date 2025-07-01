import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login-signup.css';
import { FaGoogle } from 'react-icons/fa';
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

  // OTP refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const dispatch = useDispatch();

  const handleSignup = async () => {
    const name = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmRef.current?.value || '';
    if (password !== confirmPassword) return alert("Passwords don't match");

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
    if (otpString.length !== 6) return alert('Incomplete OTP');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-and-signup', {
        ...signupData,
        otp: otpString
      });

      if (response.data.success) {
        

        navigate('/login'); // Redirect to home after signup
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Verification error');
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

  return (
    <div className="auth-wrapper">
      {!showOTP ? (
        <form className="auth-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="auth-title">Sign Up</h2>
          <input type="text" placeholder="Name" ref={nameRef} required className="auth-input" />
          <input type="email" placeholder="Email" ref={emailRef} required className="auth-input" />
          <input type="password" placeholder="Password" ref={passwordRef} required className="auth-input" />
          <input type="password" placeholder="Confirm Password" ref={confirmRef} required className="auth-input" />
          <button className="auth-btn" onClick={handleSignup}>Sign Up</button>
          <button className="auth-btn google" type="button" onClick={handleGoogleSignup}>
            <FaGoogle className="google-icon" /> Sign up with Google
          </button>
        </form>
      ) : (
        <form className="auth-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="auth-title">Verify Email</h2>
          <p className="auth-subtitle">Enter the 6-digit code sent to {signupData.email}</p>
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
          <div className="otp-buttons">
            <button className="auth-btn" onClick={() => setShowOTP(false)}>Back</button>
            <button className="auth-btn" onClick={handleVerify}>Verify</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
