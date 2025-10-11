import React from 'react';
import type { TaskListCardData } from '@/types/ai.types';
import { formatDate } from '@/utils/formatters';

interface TaskListCardProps {
  data: TaskListCardData;
}

export const TaskListCard: React.FC<TaskListCardProps> = ({ data }) => {
  const tasks = data.tareas_pendientes || data.tareas || [];
  
  if (tasks.length === 0) {
    const emptyMessage = data.miembro 
      ? `${data.miembro} no tiene tareas pendientes`
      : 'No hay tareas pendientes en el grupo';
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {data.miembro ? `Tareas de ${data.miembro}` : 'Tareas del Grupo'}
        </h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">{emptyMessage}</div>
          <div className="text-sm text-gray-400">
            {data.miembro ? 'Asigna tareas para comenzar' : 'Crea tareas para comenzar a colaborar'}
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'completada': return 'text-green-600 bg-green-100';
      case 'en_progreso': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente': return 'Pendiente';
      case 'completada': return 'Completada';
      case 'en_progreso': return 'En Progreso';
      default: return status;
    }
  };

  const getTitle = () => {
    if (data.miembro) {
      return `Tareas de ${data.miembro}`;
    }
    return 'Tareas del Grupo';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
        </div>
        <span className="text-sm text-gray-500">{data.total} tareas</span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {task.miembro && (
                  <div className="text-sm text-gray-600">Asignada a: {task.miembro}</div>
                )}
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">Vence:</span>
                <span className="font-medium text-gray-900">{formatDate(task.deadline)}</span>
              </div>
              <div className="text-gray-500">ID: {task.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
