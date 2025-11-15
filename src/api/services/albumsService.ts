import axios from 'axios';
import { STORAGE_KEYS } from '@/config/storageKeys';
import type { Album } from '@/types/moments.types';

// Create custom axios instance for albums API (without /v1)
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || (window as any).ENV?.VITE_API_GATEWAY_URL;

const albumsApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
albumsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface CreateAlbumRequest {
  titulo: string;
  descripcion?: string;
  group_id: string;
}

export interface AddMomentToAlbumRequest {
  id_album: number;
  id_momento: number;
  group_id: string;
}

export interface AlbumsResponse {
  albums: Album[];
  count: number;
}

// Albums Services
export const albumsService = {
  // Create a new album
  create: async (data: CreateAlbumRequest): Promise<Album> => {
    const response = await albumsApi.post('/albums', data);
    return response.data;
  },

  // Get all albums for a group (includes momentos in each album)
  list: async (groupId: string): Promise<Album[]> => {
    const response = await albumsApi.get(`/albums?group_id=${groupId}`);
    return response.data;
  },

  // Add a moment to an album
  addMoment: async (data: AddMomentToAlbumRequest): Promise<void> => {
    await albumsApi.post('/albums/agregar-momento', data);
  },
};

export default albumsService;
