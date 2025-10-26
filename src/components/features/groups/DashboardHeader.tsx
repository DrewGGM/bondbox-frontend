import React from 'react';
import { Plus, Home, KeyRound } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onCreateGroup,
  onJoinGroup,
}) => {
  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {userName ? `Hola, ${userName}` : 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-600">
              Gestiona tus grupos y colabora con tu familia
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
        <button
          onClick={onJoinGroup}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors text-sm shadow-sm"
        >
          <KeyRound className="w-4 h-4" />
          Unirse con Código
        </button>
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Crear Grupo
        </button>
      </div>
    </div>
  );
};
