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
    <div className="bg-white border-2 border-green-500 rounded-lg p-3 md:p-4 mt-2">
      <div className="flex justify-between items-start mb-2 md:mb-3 gap-2">
        <div className="font-semibold text-sm md:text-base text-gray-800 break-words">📋 {data.title}</div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[data.priority]} flex-shrink-0`}>
          {data.priority}
        </span>
      </div>
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
        <div className="break-words">Asignado a: {data.assignedTo}</div>
        <div>Fecha: {data.date}</div>
      </div>
    </div>
  );
};