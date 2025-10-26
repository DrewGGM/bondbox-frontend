import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      name: 'bondbox-selected-group',
    }
  )
);
