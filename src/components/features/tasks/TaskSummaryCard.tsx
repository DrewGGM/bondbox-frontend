import React from 'react';

interface SummaryStats {
  total: number;
  completedToday: number;
  pending: number;
  overdue: number;
}

interface TaskSummaryCardProps {
  stats: SummaryStats;
}

export const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-bold text-gray-900">Resumen de Tareas</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total de tareas</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{stats.completedToday}</div>
          <div className="text-sm text-gray-600 mt-1">Completadas hoy</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 mt-1">Pendientes</div>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600 mt-1">Vencidas</div>
        </div>
      </div>
    </div>
  );
};
