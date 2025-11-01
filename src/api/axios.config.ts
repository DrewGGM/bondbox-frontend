import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || (window as any).ENV?.VITE_API_GATEWAY_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
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
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
