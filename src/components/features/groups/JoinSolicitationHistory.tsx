import React from 'react';
import { JoinSolicitationCard, JoinSolicitation } from './JoinSolicitationCard';
import { History } from 'lucide-react';

interface JoinSolicitationHistoryProps {
  solicitations: JoinSolicitation[];
  loading?: boolean;
}

export const JoinSolicitationHistory: React.FC<JoinSolicitationHistoryProps> = ({
  solicitations,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (solicitations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <History className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No hay solicitudes en el historial</p>
          <p className="text-sm text-gray-500 mt-1">
            Aquí aparecerán todas tus solicitudes de unión enviadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {solicitations.map((solicitation) => (
        <JoinSolicitationCard
          key={solicitation.id}
          solicitation={solicitation}
          showActions={false}
        />
      ))}
    </div>
  );
};
