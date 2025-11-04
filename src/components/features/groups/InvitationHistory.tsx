import React, { useState } from 'react';
import { InvitationCard, Invitation, InvitationStatus } from './InvitationCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { History } from 'lucide-react';

interface InvitationHistoryProps {
  invitations: Invitation[];
  loading?: boolean;
}

type FilterStatus = 'all' | InvitationStatus;

export const InvitationHistory: React.FC<InvitationHistoryProps> = ({
  invitations,
  loading = false,
}) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredInvitations = invitations.filter((inv) =>
    filterStatus === 'all' ? true : inv.status === filterStatus
  );

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'all') return invitations.length;
    return invitations.filter((inv) => inv.status === status).length;
  };

  const filterButtons: Array<{ label: string; value: FilterStatus; color: string }> = [
    { label: 'Todas', value: 'all', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
    {
      label: 'Pendientes',
      value: InvitationStatus.PENDING,
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
    },
    {
      label: 'Aceptadas',
      value: InvitationStatus.ACCEPTED,
      color: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    },
    {
      label: 'Rechazadas',
      value: InvitationStatus.DECLINED,
      color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
    },
    {
      label: 'Expiradas',
      value: InvitationStatus.EXPIRED,
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Cargando historial..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Historial de Invitaciones
        </h2>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilterStatus(btn.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              filterStatus === btn.value
                ? 'ring-2 ring-primary ring-offset-1'
                : 'border-transparent'
            } ${btn.color}`}
          >
            {btn.label} ({getStatusCount(btn.value)})
          </button>
        ))}
      </div>

      {/* Invitations List */}
      {filteredInvitations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <History className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            No hay invitaciones{' '}
            {filterStatus !== 'all' && filterButtons.find((b) => b.value === filterStatus)?.label.toLowerCase()}
          </h3>
          <p className="text-xs text-gray-500">
            {filterStatus === 'all'
              ? 'Tu historial de invitaciones aparecerá aquí'
              : 'Intenta con otro filtro'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
