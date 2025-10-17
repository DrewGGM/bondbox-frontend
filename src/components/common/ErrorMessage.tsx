import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  type = 'error',
  className = '',
}) => {
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  return (
    <div className={`p-4 border rounded-lg ${typeClasses[type]} ${className}`}>
      <div className="flex items-start">
        <AlertCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${iconClasses[type]}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 flex-shrink-0 ${iconClasses[type]} hover:opacity-75`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
