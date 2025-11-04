import React from 'react';
import { Send, Clock, Check, X } from 'lucide-react';

export enum JoinSolicitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  DECLINED = 2,
  CANCELLED = 3,
}

export interface JoinSolicitation {
  id: string;
  idUser: string;
  status: JoinSolicitationStatus;
  groupName?: string;
  groupId: string;
  createdAt?: string;
}

interface JoinSolicitationCardProps {
  solicitation: JoinSolicitation;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export const JoinSolicitationCard: React.FC<JoinSolicitationCardProps> = ({
  solicitation,
  onCancel,
  isLoading = false,
  showActions = true,
}) => {
  const getStatusBadge = (status: JoinSolicitationStatus) => {
    switch (status) {
      case JoinSolicitationStatus.PENDING:
        return (
          <span className="px-2 py-1 rounded-md bg-primary/10 text-xs text-primary font-medium">
            Pendiente
          </span>
        );
      case JoinSolicitationStatus.ACCEPTED:
        return (
          <span className="px-2 py-1 rounded-md bg-green-100 text-xs text-green-700 font-medium">
            Aceptada
          </span>
        );
      case JoinSolicitationStatus.DECLINED:
        return (
          <span className="px-2 py-1 rounded-md bg-red-100 text-xs text-red-600 font-medium">
            Rechazada
          </span>
        );
      case JoinSolicitationStatus.CANCELLED:
        return (
          <span className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-medium">
            Cancelada
          </span>
        );
    }
  };

  const isPending = solicitation.status === JoinSolicitationStatus.PENDING;

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon */}
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Send className="w-5 h-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {solicitation.groupName || `Grupo: ${solicitation.groupId.slice(-8)}`}
              </h3>
              {getStatusBadge(solicitation.status)}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Solicitud de unión enviada
            </p>

            {/* Date */}
            {solicitation.createdAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  Enviada: {new Date(solicitation.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions - Only show for pending solicitations */}
      {showActions && isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onCancel?.(solicitation.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Cancelar Solicitud
          </button>
        </div>
      )}
    </div>
  );
};
