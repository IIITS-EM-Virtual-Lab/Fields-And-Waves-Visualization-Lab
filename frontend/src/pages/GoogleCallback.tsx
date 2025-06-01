import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get token and user data from URL
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');

        // If we don't have the data, we're not in a callback
        if (!token || !userData) {
          navigate('/auth');
          return;
        }

        // Update Redux store with user data
        dispatch(setCredentials({
          token,
          client: JSON.parse(userData)
        }));

        // Redirect to home page
        navigate('/home');
      } catch (error) {
        console.error('Error handling Google callback:', error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [dispatch, navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f6f5f7'
    }}>
      <h2>Processing Google Sign In...</h2>
    </div>
  );
};

export default GoogleCallback; 