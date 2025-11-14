import type { GroupInformation } from '@/types/groups.types';

const CACHE_KEY = 'bondbox_groups_cache';
const CACHE_TIMESTAMP_KEY = 'bondbox_groups_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const groupsCache = {
  /**
   * Guarda los grupos en localStorage con timestamp
   */
  set(groups: GroupInformation[]): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(groups));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('[GroupsCache] Error saving to cache:', error);
    }
  },

  /**
   * Obtiene los grupos del cache si están disponibles y no han expirado
   */
  get(): GroupInformation[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cached || !timestamp) {
        return null;
      }

      const age = Date.now() - parseInt(timestamp, 10);

      // Si el cache es muy viejo, devolverlo pero marcarlo como stale
      if (age > CACHE_DURATION) {
        return null;
      }

      return JSON.parse(cached) as GroupInformation[];
    } catch (error) {
      console.error('[GroupsCache] Error reading from cache:', error);
      return null;
    }
  },

  /**
   * Obtiene los grupos del cache sin importar si expiraron (para carga rápida)
   */
  getStale(): GroupInformation[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      return JSON.parse(cached) as GroupInformation[];
    } catch (error) {
      console.error('[GroupsCache] Error reading stale cache:', error);
      return null;
    }
  },

  /**
   * Limpia el cache
   */
  clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('[GroupsCache] Error clearing cache:', error);
    }
  },

  /**
   * Invalida el cache (lo marca como expirado)
   */
  invalidate(): void {
    try {
      localStorage.setItem(CACHE_TIMESTAMP_KEY, '0');
    } catch (error) {
      console.error('[GroupsCache] Error invalidating cache:', error);
    }
  },
};
