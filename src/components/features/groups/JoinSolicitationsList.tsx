import React, { useState } from 'react';
import { JoinSolicitationCard, JoinSolicitation, JoinSolicitationStatus } from './JoinSolicitationCard';
import { Inbox, ChevronDown, ChevronUp } from 'lucide-react';

interface JoinSolicitationsListProps {
  solicitations: JoinSolicitation[];
  onCancel?: (id: string) => void;
  loading?: boolean;
  actionLoading?: boolean;
}

const ITEMS_PER_PAGE = 3;

export const JoinSolicitationsList: React.FC<JoinSolicitationsListProps> = ({
  solicitations,
  onCancel,
  loading = false,
  actionLoading = false,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Filter to show only pending solicitations
  const pendingSolicitations = solicitations.filter(
    (sol) => sol.status === JoinSolicitationStatus.PENDING
  );

  const displayedSolicitations = showAll
    ? pendingSolicitations
    : pendingSolicitations.slice(0, ITEMS_PER_PAGE);

  const hasMore = pendingSolicitations.length > ITEMS_PER_PAGE;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (pendingSolicitations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No tienes solicitudes pendientes</p>
          <p className="text-sm text-gray-500 mt-1">
            Usa el botón "Unirse a Grupo" para solicitar unirte a un grupo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedSolicitations.map((solicitation) => (
          <JoinSolicitationCard
            key={solicitation.id}
            solicitation={solicitation}
            onCancel={onCancel}
            isLoading={actionLoading}
            showActions={true}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            {showAll ? (
              <>
                Ver menos
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Ver más ({pendingSolicitations.length - ITEMS_PER_PAGE} más)
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
