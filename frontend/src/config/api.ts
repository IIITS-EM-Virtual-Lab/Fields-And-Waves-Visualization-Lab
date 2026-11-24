import axios from 'axios';

export const API_BASE_URL: string =
  (import.meta.env.VITE_BACKEND_API_URL as string | undefined) ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://fields-and-waves-visualization-lab.onrender.com');

axios.defaults.withCredentials = true;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const warmUpServer = () => {
  try {
    fetch(`${API_BASE_URL}/health`, { method: 'GET', credentials: 'omit' }).catch(() => {});
  } catch (e) {
  }
};
