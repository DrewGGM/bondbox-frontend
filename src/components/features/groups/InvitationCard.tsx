import React from 'react';
import { Mail, Clock, Check, X } from 'lucide-react';

export enum InvitationStatus {
  PENDING = 0,
  ACCEPTED = 1,
  CANCELLED = 2,
  DECLINED = 3,
  EXPIRED = 4,
}

export interface Invitation {
  id: string;
  createdAt: string;
  expiresIn: string;
  status: InvitationStatus;
  fromUser: string;
  toUser: string;
  idGroup: string;
  rol: {
    id: string;
    rolName: string;
  };
  // Optional fields for display (populated from other API calls)
  groupName?: string;
  fromUserName?: string;
}

interface InvitationCardProps {
  invitation: Invitation;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
  isLoading = false,
  showActions = true,
}) => {
  const formatExpirationDate = (dateString: string, status: InvitationStatus) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (status === InvitationStatus.EXPIRED) {
      return `Expiró el ${date.toLocaleDateString('es-ES')}`;
    }

    if (days <= 0) return 'Expira hoy';
    if (days === 1) return 'Expira mañana';
    return `Expira en ${days} días`;
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return (
          <span className="px-2 py-1 rounded-md bg-primary/10 text-xs text-primary font-medium">
            Pendiente
          </span>
        );
      case InvitationStatus.ACCEPTED:
        return (
          <span className="px-2 py-1 rounded-md bg-green-100 text-xs text-green-700 font-medium">
            Aceptada
          </span>
        );
      case InvitationStatus.CANCELLED:
        return (
          <span className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-medium">
            Cancelada
          </span>
        );
      case InvitationStatus.DECLINED:
        return (
          <span className="px-2 py-1 rounded-md bg-red-100 text-xs text-red-600 font-medium">
            Rechazada
          </span>
        );
      case InvitationStatus.EXPIRED:
        return (
          <span className="px-2 py-1 rounded-md bg-orange-100 text-xs text-orange-600 font-medium">
            Expirada
          </span>
        );
    }
  };

  const isPending = invitation.status === InvitationStatus.PENDING;

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon */}
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {invitation.groupName || `Grupo: ${invitation.idGroup.slice(-8)}`}
              </h3>
              {getStatusBadge(invitation.status)}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Invitado por{' '}
              <span className="font-medium">
                {invitation.fromUserName || `Usuario ${invitation.fromUser.slice(-8)}`}
              </span>
            </p>

            {invitation.rol && (
              <div className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 border border-purple-200 mb-2">
                <span className="text-xs text-purple-700 font-medium">
                  Rol: {invitation.rol.rolName}
                </span>
              </div>
            )}

            {/* Dates */}
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              {(invitation.status === InvitationStatus.PENDING ||
                invitation.status === InvitationStatus.EXPIRED) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatExpirationDate(invitation.expiresIn, invitation.status)}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-400">
                Creada: {new Date(invitation.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Only show for pending invitations */}
      {showActions && isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onDecline?.(invitation.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Rechazar
          </button>
          <button
            onClick={() => onAccept?.(invitation.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
};
