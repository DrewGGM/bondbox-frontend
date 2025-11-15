import { useState, useCallback } from 'react';

import type {
  Etiqueta,
  Moment,
  CreateEtiquetaRequest,
} from '@/types/moments.types';
import { etiquetasService } from '@/api/services/etiquetasService';

interface UseEtiquetasState {
  etiquetas: Etiqueta[];
  momentosFiltrados: Moment[];
  loading: boolean;
  error: string | null;
}

interface UseEtiquetasActions {
  crearEtiqueta: (data: CreateEtiquetaRequest) => Promise<void>;
  obtenerEtiquetasDeMomento: (momentoId: string) => Promise<void>;
  buscarPorEtiqueta: (nombreEtiqueta: string, groupId: string) => Promise<void>;
  limpiarFiltro: () => void;
  clearError: () => void;
}

export const useEtiquetas = (): UseEtiquetasState & UseEtiquetasActions => {
  const [state, setState] = useState<UseEtiquetasState>({
    etiquetas: [],
    momentosFiltrados: [],
    loading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Crear etiqueta
  const crearEtiqueta = useCallback(async (data: CreateEtiquetaRequest) => {
    setLoading(true);
    setError(null);

    try {
  await etiquetasService.create(data);
      // Recargar las etiquetas del momento después de crear
      await obtenerEtiquetasDeMomento(data.id_momento);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear etiqueta');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener etiquetas de un momento específico
  const obtenerEtiquetasDeMomento = useCallback(async (momentoId: string) => {
    setLoading(true);
    setError(null);

    try {
  const response = await etiquetasService.listByMomento(momentoId);
      setState(prev => ({ 
        ...prev, 
        etiquetas: response.etiquetas || [] 
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar momentos por nombre de etiqueta
  const buscarPorEtiqueta = useCallback(async (nombreEtiqueta: string, groupId: string) => {
    if (!nombreEtiqueta.trim()) {
      limpiarFiltro();
      return;
    }

    setLoading(true);
    setError(null);

    try {
  const response = await etiquetasService.searchByTag(nombreEtiqueta, groupId);
      setState(prev => ({ 
        ...prev, 
        momentosFiltrados: response.momentos || [] 
      }));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al buscar etiquetas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar filtro de búsqueda
  const limpiarFiltro = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      momentosFiltrados: [] 
    }));
  }, []);

  return {
    ...state,
    crearEtiqueta,
    obtenerEtiquetasDeMomento,
    buscarPorEtiqueta,
    limpiarFiltro,
    clearError: () => setError(null),
  };
};