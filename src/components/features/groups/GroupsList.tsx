import React from 'react';
import { GroupCard, Group } from './GroupCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface GroupsListProps {
  groups: Group[];
  onViewDetails?: (group: Group) => void;
  onSelectGroup: (group: Group) => void;
  selectedGroupId?: string;
  loading?: boolean;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  onViewDetails,
  onSelectGroup,
  selectedGroupId,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Cargando grupos..." />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes grupos aún
        </h3>
        <p className="text-sm text-gray-500">
          Crea tu primer grupo para empezar a colaborar con tu familia
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onViewDetails={onViewDetails}
          onSelectGroup={onSelectGroup}
          isSelected={selectedGroupId === group.id}
        />
      ))}
    </div>
  );
};
