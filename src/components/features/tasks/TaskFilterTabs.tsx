import React from 'react';

export type TaskStatus = 'all' | 'pending' | 'in_progress' | 'completed' | 'overdue';

interface TaskFilterTabsProps {
  activeFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
  counts: {
    all: number;
    pending: number;
    in_progress: number;
    completed: number;
    overdue: number;
  };
}

export const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const tabs = [
    { id: 'all' as TaskStatus, label: 'Todas', count: counts.all },
    { id: 'pending' as TaskStatus, label: 'Pendientes', count: counts.pending },
    { id: 'in_progress' as TaskStatus, label: 'En progreso', count: counts.in_progress },
    { id: 'completed' as TaskStatus, label: 'Completadas', count: counts.completed },
    { id: 'overdue' as TaskStatus, label: 'Vencidas', count: counts.overdue },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeFilter === tab.id
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {tab.label}{' '}
          <span
            className={`ml-1 ${
              activeFilter === tab.id ? 'text-orange-100' : 'text-gray-500'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};
