import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});

// Attach JWT token to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillgap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle global 401 → auto logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('skillgap_user');
      localStorage.removeItem('skillgap_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
