import { useState, useEffect, useCallback } from 'react';
import { momentService } from '@/api/services/momentsService';
import { etiquetasService } from '@/api/services/etiquetasService';
import { GroupsServiceImp } from '@/api/services/groupService';
import type {
  Moment,
  CreateMomentRequest,
  UpdateMomentRequest,
  CreateEtiquetaRequest,
} from '@/types/moments.types';
import type { UsersGroupInformation } from '@/types/groups.types';

interface UseMomentsState {
  moments: Moment[];
  groupMembers: UsersGroupInformation[];
  loading: boolean;
  error: string | null;
}

interface UseMomentsActions {
  // Moment actions
  createMoment: (data: CreateMomentRequest) => Promise<Moment | null>;
  updateMoment: (id: number, data: UpdateMomentRequest) => Promise<void>;
  deleteMoment: (id: number) => Promise<void>;
  loadMoments: (albumId?: number) => Promise<void>;

  // Etiqueta actions
  createEtiqueta: (data: CreateEtiquetaRequest) => Promise<void>;
  searchByEtiqueta: (nombre: string) => Promise<void>;

  // Group actions
  loadGroupMembers: () => Promise<void>;

  // Common actions
  clearError: () => void;
}

export const useMoments = (groupId: string): UseMomentsState & UseMomentsActions => {
  const groupService = new GroupsServiceImp();

  const [state, setState] = useState<UseMomentsState>({
    moments: [],
    groupMembers: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Cargar momentos
  const loadMoments = useCallback(async (albumId?: number) => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await momentService.list(groupId, albumId);
      // Backend returns array directly, not wrapped in object
      const momentsArray = Array.isArray(response) ? response : (response.momentos || []);
      setState(prev => ({
        ...prev,
        moments: momentsArray
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar momentos');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Crear momento
  const createMoment = useCallback(async (data: CreateMomentRequest): Promise<Moment | null> => {
    if (!groupId) return null;

    setError(null);

    try {
      const newMoment = await momentService.create({ ...data, group_id: groupId });
      return newMoment;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear momento');
      throw error;
    }
  }, [groupId]);

  // Actualizar momento
  const updateMoment = useCallback(async (id: number, data: UpdateMomentRequest) => {
    if (!groupId) return;

    setError(null);

    try {
      await momentService.update(String(id), data, groupId);
      await loadMoments(); // Recargar la lista después de actualizar
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar momento');
      throw error;
    }
  }, [groupId, loadMoments]);

  // Eliminar momento
  const deleteMoment = useCallback(async (id: number) => {
    if (!groupId) return;

    setError(null);

    try {
      await momentService.delete(String(id), groupId);
      // Eliminación optimista - quitar de la lista inmediatamente
      setState(prev => ({
        ...prev,
        moments: prev.moments.filter(m => m.id !== id)
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar momento');
      // Si falla, recargar para restaurar el estado
      await loadMoments();
      throw error;
    }
  }, [groupId, loadMoments]);

  // ==================== ETIQUETA ACTIONS ====================

  // Create etiqueta
  const createEtiqueta = useCallback(async (data: CreateEtiquetaRequest) => {
    if (!groupId) return;

    setError(null);

    try {
      await etiquetasService.create(data);
      await loadMoments(); // Reload moments to get updated tags
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear etiqueta');
      throw error;
    }
  }, [groupId, loadMoments]);

  // Search moments by etiqueta
  const searchByEtiqueta = useCallback(async (nombre: string) => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await etiquetasService.searchByTag(nombre, groupId);
      setState(prev => ({
        ...prev,
        moments: response.momentos || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al buscar por etiqueta');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // ==================== GROUP ACTIONS ====================

  // Load group members
  const loadGroupMembers = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await groupService.getUsersGroup(groupId);
      setState(prev => ({
        ...prev,
        groupMembers: response || []
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar miembros del grupo');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // ==================== EFFECTS ====================

  // Load initial data on mount
  useEffect(() => {
    if (groupId) {
      loadMoments();
      loadGroupMembers();
    }
  }, [groupId, loadMoments, loadGroupMembers]);

  return {
    ...state,
    createMoment,
    updateMoment,
    deleteMoment,
    loadMoments,
    createEtiqueta,
    searchByEtiqueta,
    loadGroupMembers,
    clearError: () => setError(null),
  };
};