import React from 'react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export const AgentStatusCard: React.FC = () => {
  const { healthStatus, isHealthy, isMCPConnected, checkHealth } = useHealthCheck();

  const getStatusIcon = () => {
    if (healthStatus.status === 'checking') {
      return (
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    if (isHealthy && isMCPConnected) {
      return (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    if (isHealthy && !isMCPConnected) {
      return (
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  const getStatusText = () => {
    if (healthStatus.status === 'checking') {
      return 'Verificando...';
    }
    
    if (isHealthy && isMCPConnected) {
      return 'Agente Activo';
    }
    
    if (isHealthy && !isMCPConnected) {
      return 'Servidor Activo';
    }
    
    return 'Agente Inactivo';
  };

  const getStatusColor = () => {
    if (healthStatus.status === 'checking') {
      return 'text-yellow-600';
    }
    
    if (isHealthy && isMCPConnected) {
      return 'text-green-600';
    }
    
    if (isHealthy && !isMCPConnected) {
      return 'text-orange-600';
    }
    
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado del Agente</h3>
        <button
          onClick={checkHealth}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Verificar estado"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        {getStatusIcon()}
        <div>
          <div className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          <div className="text-sm text-gray-500">
            {isMCPConnected ? 'MCP Conectado' : 'MCP Desconectado'}
          </div>
        </div>
      </div>
      
      {healthStatus.server_path && (
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Servidor:</span> {healthStatus.server_path}
        </div>
      )}
      
      {healthStatus.lastChecked && (
        <div className="text-xs text-gray-500">
          Última verificación: {healthStatus.lastChecked.toLocaleTimeString()}
        </div>
      )}
      
      {healthStatus.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          Error: {healthStatus.error}
        </div>
      )}
    </div>
  );
};
