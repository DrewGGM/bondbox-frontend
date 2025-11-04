import React from 'react';
import { Plus, Users } from 'lucide-react';

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

export const GroupsHeader: React.FC<GroupsHeaderProps> = ({ onCreateGroup }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Mis Grupos
        </h1>
      </div>

      <button
        onClick={onCreateGroup}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        Crear Grupo
      </button>
    </div>
  );
};
