// /src/pages/Settings.tsx
import React, { useState, useRef } from 'react';
import './login-signup.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';

const Settings = () => {
  const user = useSelector(selectCurrentUser);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!user) {
        setError("User not available");
        return;
    }
    const name = nameRef.current?.value.trim() || '';
    const password = passwordRef.current?.value.trim() || '';
    const confirmPassword = confirmRef.current?.value.trim() || '';

    if (!name && !password) {
      setError("Nothing to update");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (password) payload.password = password;

      const res = await axios.put(`https://fields-and-waves-visualization-lab.onrender.com/api/users/${user._id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        setMessage("Settings updated successfully");
        setError('');
      } else {
        throw new Error(res.data.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update settings");
      setMessage('');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
        setError("User not available");
        return;
    }
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    try {
      const res = await axios.delete(`https://fields-and-waves-visualization-lab.onrender.com/api/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        localStorage.clear();
        window.location.href = '/signup';
      } else {
        throw new Error(res.data.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-illustration">
            <img src="/college project-rafiki.png" alt="Settings Illustration" />
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Account Settings</h2>
              <p className="auth-subtitle">Update your profile and credentials</p>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Update your name"
                  ref={nameRef}
                  className="auth-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  ref={passwordRef}
                  className="auth-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  ref={confirmRef}
                  className="auth-input"
                />
              </div>

              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}

              <div className="auth-actions">
                <button className="auth-btn primary" onClick={handleUpdate}>Save Changes</button>
                <button className="auth-btn danger" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
