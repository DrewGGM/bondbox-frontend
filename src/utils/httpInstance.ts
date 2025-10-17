import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

const API_VERSION = 'v1';

const httpInstance = axios.create({
    baseURL: `${BASE_URL}/api/${API_VERSION}`,
    timeout:10000,
    headers: {
      'Content-Type': 'application/json',
    },
});

httpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bondbox-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpInstance;