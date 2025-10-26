import React, { useState } from 'react';
import { Users, Eye, CheckCircle2 } from 'lucide-react';

export interface Group {
  id: string;
  name: string;
  memberCount?: number;
}

interface GroupCardProps {
  group: Group;
  onViewDetails?: (group: Group) => void;
  onSelectGroup: (group: Group) => void;
  isSelected?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onViewDetails,
  onSelectGroup,
  isSelected = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full bg-white p-5 rounded-xl shadow-sm border transition-all duration-200 ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-gray-100 hover:shadow-md hover:border-primary/20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Activo
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-4 flex-1">
          {/* Group Icon */}
          <div
            className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              isSelected
                ? 'from-primary to-primary-dark'
                : 'from-blue-100 to-blue-50 group-hover:from-blue-200 group-hover:to-blue-100'
            }`}
          >
            <Users className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
          </div>

          {/* Group Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-1 truncate transition-colors ${
                isSelected ? 'text-primary' : 'text-gray-900'
              }`}
            >
              {group.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{group.memberCount || 0} miembros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <div
        className={`transition-all duration-200 overflow-hidden ${
          isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-3 border-t border-gray-100 flex gap-2">
          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(group);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectGroup(group);
            }}
            disabled={isSelected}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 font-medium rounded-lg transition-colors text-sm ${
              isSelected
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSelected ? 'Seleccionado' : 'Seleccionar'}
          </button>
        </div>
      </div>
    </div>
  );
};
