import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

const API_VERSION = 'v1';

// Base configuration shared by all instances
const baseConfig = {
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// HTTP instance for user/auth endpoints (login, register, OTP)
// No auth token required
export const userHttpInstance = axios.create(baseConfig);

// HTTP instance for authenticated endpoints (groups, finance, etc.)
// Automatically adds auth token to requests
export const authenticatedHttpInstance = axios.create(baseConfig);

authenticatedHttpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Default export for backward compatibility
export default userHttpInstance;