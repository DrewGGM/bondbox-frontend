import axios from "axios";
import { STORAGE_KEYS } from '@/config/storageKeys';

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || (window as any).ENV?.VITE_API_GATEWAY_URL;
const API_VERSION = 'v1';

const baseConfig = {
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const userHttpInstance = axios.create(baseConfig);
export const authenticatedHttpInstance = axios.create(baseConfig);

authenticatedHttpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Default export for backward compatibility
export default userHttpInstance;