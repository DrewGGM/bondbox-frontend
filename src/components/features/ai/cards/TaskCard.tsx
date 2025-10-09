import React from 'react';
import type { TaskCardData } from '@/types/ai.types';

interface TaskCardProps {
  data: TaskCardData;
}

export const TaskCard: React.FC<TaskCardProps> = ({ data }) => {
  const priorityColors = {
    ALTA: 'bg-red-50 text-red-700',
    MEDIA: 'bg-yellow-50 text-yellow-700',
    BAJA: 'bg-green-50 text-green-700',
  };

  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-4 mt-2">
      <div className="flex justify-between items-start mb-3">
        <div className="font-semibold text-gray-800">📋 {data.title}</div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[data.priority]}`}>
          {data.priority}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div>Asignado a: {data.assignedTo}</div>
        <div>Fecha: {data.date}</div>
      </div>
    </div>
  );
};