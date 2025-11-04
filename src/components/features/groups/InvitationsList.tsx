import React, { useState } from 'react';
import { InvitationCard, Invitation, InvitationStatus } from './InvitationCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InvitationsListProps {
  invitations: Invitation[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  loading?: boolean;
  actionLoading?: boolean;
}

const ITEMS_PER_PAGE = 3;

export const InvitationsList: React.FC<InvitationsListProps> = ({
  invitations,
  onAccept,
  onDecline,
  loading = false,
  actionLoading = false,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Filter only pending invitations
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === InvitationStatus.PENDING && new Date(inv.expiresIn) > new Date()
  );

  const displayedInvitations = showAll
    ? pendingInvitations
    : pendingInvitations.slice(0, ITEMS_PER_PAGE);

  const hasMore = pendingInvitations.length > ITEMS_PER_PAGE;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" text="Cargando invitaciones..." />
      </div>
    );
  }

  if (pendingInvitations.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          No tienes invitaciones pendientes
        </h3>
        <p className="text-xs text-gray-500">
          Las invitaciones a grupos aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {displayedInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onAccept={onAccept}
            onDecline={onDecline}
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
                Ver más ({pendingInvitations.length - ITEMS_PER_PAGE} más)
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
