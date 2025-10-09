import React from 'react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

export const ChatHeader: React.FC = () => {
  const { healthStatus, isHealthy, isMCPConnected } = useHealthCheck();

  const getStatusText = () => {
    if (healthStatus.status === 'checking') {
      return 'Verificando...';
    }
    
    if (isHealthy && isMCPConnected) {
      return 'Activo';
    }
    
    return 'No activo';
  };

  const getStatusColor = () => {
    if (healthStatus.status === 'checking') {
      return 'bg-yellow-400';
    }
    
    if (isHealthy && isMCPConnected) {
      return 'bg-green-400';
    }
    
    return 'bg-red-400';
  };

  const getStatusAnimation = () => {
    if (healthStatus.status === 'checking') {
      return 'animate-spin';
    }
    
    if (isHealthy && isMCPConnected) {
      return 'animate-pulse';
    }
    
    return '';
  };

  return (
    <div className="chat-header">
      <div className="flex items-center gap-4">
        <div className="bot-avatar">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="#F28627">
            <circle cx="14" cy="10" r="6" stroke="#F28627" fill="none" strokeWidth="2"/>
            <rect x="8" y="16" width="12" height="8" rx="2" stroke="#F28627" fill="none" strokeWidth="2"/>
            <circle cx="9" cy="9" r="2" fill="#F28627"/>
            <circle cx="19" cy="9" r="2" fill="#F28627"/>
            <path d="M11 12h6" stroke="#F28627" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="bot-details">
          <div className="bot-name">Bondy AI</div>
          <div className="bot-status">
            <span className={`status-dot ${getStatusColor()} ${getStatusAnimation()}`}></span>
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
};