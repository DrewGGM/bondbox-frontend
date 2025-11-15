import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';
import type {
  Etiqueta,
  CreateEtiquetaRequest,
  EtiquetasResponse,
  EtiquetasBusquedaResponse,
} from '@/types/moments.types';

// Create custom axios instance for etiquetas API (without /v1)
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || (window as any).ENV?.VITE_API_GATEWAY_URL;

const etiquetasApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
etiquetasApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Etiqueta Services
export const etiquetasService = {
  // List all etiquetas for a group (returns all unique tags)
  list: async (groupId: string): Promise<EtiquetasResponse> => {
    try {
      const response = await etiquetasApi.get(`/etiquetas?group_id=${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching etiquetas:', error);
      return { etiquetas: [], count: 0 };
    }
  },

  // Create a new etiqueta
  create: async (data: CreateEtiquetaRequest): Promise<Etiqueta> => {
    const response = await etiquetasApi.post('/etiquetas', data);
    return response.data;
  },

  // Get etiquetas for a specific moment
  listByMomento: async (momentoId: string): Promise<EtiquetasResponse> => {
    const response = await etiquetasApi.get(`/etiquetas/${momentoId}`);
    return response.data;
  },

  // Search moments by tag name
  searchByTag: async (nombreEtiqueta: string, groupId: string): Promise<EtiquetasBusquedaResponse> => {
    const response = await etiquetasApi.get(`/etiquetas/buscar/${nombreEtiqueta}?group_id=${groupId}`);
    return response.data;
  },
};

export default etiquetasService;