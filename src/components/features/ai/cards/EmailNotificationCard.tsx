import React from 'react';
import type { EmailNotificationCardData } from '@/types/ai.types';

interface EmailNotificationCardProps {
  data: EmailNotificationCardData;
}

export const EmailNotificationCard: React.FC<EmailNotificationCardProps> = ({ data }) => {
  const getStatusIcon = (success: boolean) => {
    return success ? (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ) : (
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusText = (success: boolean) => {
    return success ? 'Enviado exitosamente' : 'Error al enviar';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start space-x-3">
        {getStatusIcon(data.success)}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Notificación por Email</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.success)}`}>
              {getStatusText(data.success)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600">Destinatario:</span>
              <span className="text-sm font-medium text-gray-900">{data.email_sent_to}</span>
            </div>
            
            {data.message && (
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">{data.message}</span>
              </div>
            )}
            
            {data.subject && (
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <div>
                  <span className="text-sm text-gray-600">Asunto: </span>
                  <span className="text-sm font-medium text-gray-900">{data.subject}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
