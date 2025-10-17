import React from 'react';
import type { TaskCreatedCardData } from '@/types/ai.types';

interface TaskCreatedCardProps {
  data: TaskCreatedCardData;
}

export const TaskCreatedCard: React.FC<TaskCreatedCardProps> = ({ data }) => {
  const getStatusIcon = () => {
    return (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Tarea Creada</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.tarea_creada.status)}`}>
              {getStatusText(data.tarea_creada.status)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-gray-600">Asignada a:</span>
              <span className="text-sm font-medium text-gray-900">{data.asignada_a}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm text-gray-600">ID de tarea:</span>
              <span className="text-sm font-medium text-gray-900">{data.tarea_creada.id}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-600">Estado:</span>
              <span className="text-sm font-medium text-gray-900">{getStatusText(data.tarea_creada.status)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
