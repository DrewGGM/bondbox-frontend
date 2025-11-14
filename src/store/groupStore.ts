import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { groupsCache } from '@/utils/groupsCache';

export interface SelectedGroup {
  id: string;
  name: string;
  memberCount?: number;
}

interface GroupState {
  selectedGroup: SelectedGroup | null;
  setSelectedGroup: (group: SelectedGroup) => void;
  clearSelectedGroup: () => void;
  invalidateGroupsCache: () => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      selectedGroup: null,

      setSelectedGroup: (group) => {
        set({ selectedGroup: group });
        // Invalidar cache cuando cambie el grupo para recargar en el próximo acceso
        groupsCache.invalidate();
      },

      clearSelectedGroup: () => {
        set({ selectedGroup: null });
      },

      invalidateGroupsCache: () => {
        groupsCache.invalidate();
      },
    }),
    {
      name: STORAGE_KEYS.SELECTED_GROUP,
    }
  )
);
