// /src/pages/Settings.tsx
import React, { useState, useRef } from 'react';
import './login-signup.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, setCredentials, logout } from '../store/slices/authSlice';
import { apiClient } from '../config/api';

const Settings: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!user) {
      setError('User session not available');
      return;
    }
    const name = nameRef.current?.value.trim() || '';
    const password = passwordRef.current?.value.trim() || '';
    const confirmPassword = confirmRef.current?.value.trim() || '';

    if (!name && !password) {
      setError('Nothing to update');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsUpdating(true);
    setError('');
    setMessage('');

    try {
      const payload: any = {};
      if (name) payload.name = name;
      if (password) payload.password = password;

      const res = await apiClient.put(`/api/users/${user._id}`, payload);

      if (res.data.success) {
        setMessage('Settings updated successfully');
        if (name) {
          dispatch(
            setCredentials({
              client: {
                ...user,
                name: res.data.user?.name || name
              }
            })
          );
        }
        if (passwordRef.current) passwordRef.current.value = '';
        if (confirmRef.current) confirmRef.current.value = '';
      } else {
        throw new Error(res.data.message || 'Failed to update settings');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      setError('User not available');
      return;
    }
    if (!window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      return;
    }

    setIsUpdating(true);
    try {
      const res = await apiClient.delete(`/api/users/${user._id}`);

      if (res.data.success) {
        dispatch(logout());
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('reduxState');
        } catch (e) {}
        alert('Your account has been deleted successfully.');
        navigate('/signup');
      } else {
        throw new Error(res.data.message || 'Failed to delete account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete account');
      setIsUpdating(false);
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
                  placeholder={user?.name || 'Update your name'}
                  ref={nameRef}
                  className="auth-input"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  ref={passwordRef}
                  className="auth-input"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  ref={confirmRef}
                  className="auth-input"
                  disabled={isUpdating}
                />
              </div>

              {message && <div className="auth-alert success">{message}</div>}
              {error && <div className="auth-alert error">{error}</div>}

              <div className="auth-actions">
                <button
                  type="button"
                  className="auth-btn primary"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="auth-btn danger"
                  style={{ marginTop: '0.75rem', background: '#e53e3e', color: 'white' }}
                  onClick={handleDeleteAccount}
                  disabled={isUpdating}
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
