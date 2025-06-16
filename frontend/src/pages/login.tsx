// /src/pages/Login.tsx
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import './login-signup.css';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [resetButton, setResetButton] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Process token from Google Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const error = urlParams.get('error');

    if (error) {
      alert('Google Sign-in Failed');
      return;
    }

    if (token && name && email) {
      dispatch(setCredentials({
        token,
        client: { name, email }
      }));
      navigate('/home');
    }
  }, []);

  // ✅ Manual Login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
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
        client: { name: user.name, email: user.email }
      }));

      navigate('/home');
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(error.message || 'Login failed');
      setResetButton(true);
      setTimeout(() => setResetButton(false), 1000);
    }
  };

  // ✅ Redirect to Google OAuth URL
  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/google');
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

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={(e) => e.preventDefault()}>
        <h2 className="auth-title">Login</h2>
        <input type="email" placeholder="Email" ref={emailRef} required className="auth-input" />
        <input type="password" placeholder="Password" ref={passwordRef} required className="auth-input" />
        <button className="auth-btn" onClick={handleLogin} disabled={resetButton}>Login</button>
        <button className="auth-btn google" type="button" onClick={handleGoogleLogin}>
          <FaGoogle className="google-icon" /> Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
