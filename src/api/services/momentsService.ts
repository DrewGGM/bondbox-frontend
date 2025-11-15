import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';
import type {
  Moment,
  CreateMomentRequest,
  UpdateMomentRequest,
  MomentsResponse,
  MomentResponse,
  AddMultimediaRequest,
} from '@/types/moments.types';

// Create custom axios instance for moments API (without /v1)
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || (window as any).ENV?.VITE_API_GATEWAY_URL;

const momentsApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
momentsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Moment Services
export const momentService = {
  // List all moments for a group
  list: async (groupId: string, albumId?: number): Promise<MomentsResponse> => {
    const params = new URLSearchParams({ group_id: groupId });
    if (albumId) {
      params.append('album_id', String(albumId));
    }
    const response = await momentsApi.get(`/momentos?${params.toString()}`);
    return response.data;
  },

  // Get a single moment by ID
  getById: async (id: string, groupId: string): Promise<MomentResponse> => {
    const response = await momentsApi.get(`/momentos/${id}?group_id=${groupId}`);
    return response.data;
  },

  // Create a new moment
  create: async (data: CreateMomentRequest): Promise<Moment> => {
    const response = await momentsApi.post('/momentos', data);
    return response.data;
  },

  // Update an existing moment
  update: async (id: string, data: UpdateMomentRequest, groupId: string): Promise<Moment> => {
    const response = await momentsApi.put(`/momentos/${id}?group_id=${groupId}`, data);
    return response.data;
  },

  // Delete a moment
  delete: async (id: string, groupId: string): Promise<void> => {
    await momentsApi.delete(`/momentos/${id}?group_id=${groupId}`);
  },

  // Add multimedia to a moment
  addMultimedia: async (data: AddMultimediaRequest): Promise<void> => {
    await momentsApi.post('/multimedia', data);
  },

  // Upload file (image/video) and get URL
  uploadFile: async (file: File): Promise<{ url: string; filename: string; size: number; tipo: 'foto' | 'video' }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await momentsApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete uploaded file
  deleteFile: async (url: string): Promise<void> => {
    await momentsApi.delete('/upload', {
      data: { url },
    });
  },
};

export default momentService;
