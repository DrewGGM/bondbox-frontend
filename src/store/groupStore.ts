import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/storageKeys';

export interface SelectedGroup {
  id: string;
  name: string;
  memberCount?: number;
}

interface GroupState {
  selectedGroup: SelectedGroup | null;
  setSelectedGroup: (group: SelectedGroup) => void;
  clearSelectedGroup: () => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      selectedGroup: null,

      setSelectedGroup: (group) => {
        set({ selectedGroup: group });
      },

      clearSelectedGroup: () => {
        set({ selectedGroup: null });
      },
    }),
    {
      name: STORAGE_KEYS.SELECTED_GROUP,
    }
  )
);
