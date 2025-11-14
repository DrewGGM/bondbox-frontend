import React from 'react';
import type { Action } from '@/types/ai.types';

interface ActionBadgeProps {
  action: Action;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action }) => {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  };

  const className = action.has_error
    ? 'p-3 rounded-lg border bg-red-50 border-red-300'
    : `p-3 rounded-lg border ${colorClasses[action.color] || colorClasses.blue}`;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{action.icon}</span>
        <h4 className="font-semibold text-sm">{action.title}</h4>
        {action.has_error && (
          <span className="ml-auto text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
            Error
          </span>
        )}
      </div>

      {action.has_error && action.data.error ? (
        <div className="text-sm text-red-700 bg-red-100 p-2 rounded">
          {action.data.error}
        </div>
      ) : (
        <div className="text-xs space-y-1">
          {Object.entries(action.data).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="text-right">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      {action.timestamp && (
        <div className="text-xs text-gray-500 mt-2">
          {new Date(action.timestamp).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
};
