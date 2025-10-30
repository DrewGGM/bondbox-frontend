import axios from 'axios';

// Use runtime config if available (Docker), otherwise use build-time env
const API_BASE_URL = (window as any).ENV?.VITE_API_GATEWAY_URL || import.meta.env.VITE_API_GATEWAY_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bondbox-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bondbox-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
