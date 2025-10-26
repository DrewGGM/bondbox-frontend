import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import {
  DashboardHeader,
  GroupsList,
  InvitationsList,
  InvitationHistory,
  CreateGroupModal,
  JoinGroupModal,
  Group,
  Invitation,
  InvitationStatus,
} from '@/components/features/groups';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useGroupStore } from '@/store/groupStore';
import { History } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export const DashboardPage: React.FC = () => {

  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);

  const {userInfo,refreshUserInfo} = useUser();

  useEffect(() => {
    // Fetch data only once
    refreshUserInfo()
  }, []);

  // TODO: Replace with useGroups hook when implemented
  // const { groups, invitations, loading, error, createGroup, acceptInvitation, declineInvitation } = useGroups();

  // Mock data for now - matching real API structure
  const [groups] = useState<Group[]>([
    { id: '1', name: 'Mi Familia', memberCount: 5 },
    { id: '2', name: 'Proyecto Casa', memberCount: 3 },
    { id: '3', name: 'Grupo de Trabajo', memberCount: 8 },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 'de60fbe1-4f87-4f77-ae9b-56a81ce84c0b',
      createdAt: '2025-10-05T02:04:44.997145Z',
      expiresIn: '2025-10-25',
      status: InvitationStatus.PENDING,
      fromUser: '68dcb02ab7207ad696df1a6f',
      toUser: '68e1d0b520725e4b1059d1b2',
      idGroup: '6dba0da1-0926-4d47-8fd6-22cd3359fb44',
      rol: {
        id: 'b34a10d6-9d08-4a9c-b78a-a08fbcc9964b',
        rolName: 'wazaaaa',
      },
      groupName: 'Familia García',
      fromUserName: 'Juan García',
    },
    {
      id: '11d81c8f-7761-42c9-ac25-7f37aae769f9',
      createdAt: '2025-10-05T02:08:02.867798Z',
      expiresIn: '2025-10-25',
      status: InvitationStatus.PENDING,
      fromUser: '68dcb02ab7207ad696df1a6f',
      toUser: '68e1d0b520725e4b1059d1b2',
      idGroup: '6dba0da1-0926-4d47-8fd6-22cd3359fb44',
      rol: {
        id: 'b34a10d6-9d08-4a9c-b78a-a08fbcc9964b',
        rolName: 'admin',
      },
      groupName: 'Proyecto Vacaciones',
      fromUserName: 'María López',
    },
    // Some accepted/declined for history
    {
      id: 'history-1',
      createdAt: '2025-09-15T10:00:00Z',
      expiresIn: '2025-12-31',
      status: InvitationStatus.ACCEPTED,
      fromUser: '68dcb02ab7207ad696df1a6f',
      toUser: '68e1d0b520725e4b1059d1b2',
      idGroup: '1',
      rol: {
        id: 'rol-1',
        rolName: 'Miembro',
      },
      groupName: 'Mi Familia',
      fromUserName: 'Pedro Sánchez',
    },
    {
      id: 'history-2',
      createdAt: '2025-09-20T14:30:00Z',
      expiresIn: '2025-12-31',
      status: InvitationStatus.DECLINED,
      fromUser: '68dcb02ab7207ad696df1a6f',
      toUser: '68e1d0b520725e4b1059d1b2',
      idGroup: '2',
      rol: {
        id: 'rol-2',
        rolName: 'Colaborador',
      },
      groupName: 'Grupo Antiguo',
      fromUserName: 'Ana Torres',
    },
  ]);

  const loading = false;
  const error = null;
  const userName = userInfo?.full_name || "User"

  const handleCreateGroup = async (name: string) => {
    setIsCreating(true);

    try {
      // TODO: Implement API call
      // await createGroup({ name });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Grupo "${name}" creado exitosamente`);
      setShowCreateModal(false);

      // TODO: Reload groups after creation
      // await loadGroups();
    } catch (err) {
      toast.error('Error al crear el grupo');
      console.error('Error creating group:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async (code: string) => {
    setIsJoining(true);

    try {
      // TODO: Implement API call
      // POST /api/v1/joinSolicitations/unionByCode/{code}
      // await joinGroupByCode(code);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Solicitud de unión enviada exitosamente`, {
        icon: '✉️',
        duration: 4000,
      });
      setShowJoinModal(false);

      // TODO: Reload groups/invitations after joining
      // await loadGroups();
    } catch (err) {
      toast.error('Código inválido o error al unirse al grupo');
      console.error('Error joining group:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
  };

  const handleSelectGroup = (group: Group) => {
    // Set selected group in store
    setSelectedGroup(group);
    toast.success(`Grupo "${group.name}" seleccionado como contexto activo`, {
      icon: '✅',
      duration: 3000,
    });
  };

  const handleViewDetails = (group: Group) => {
    // TODO: Navigate to group detail page
    toast(`Ver detalles de: ${group.name}`, {
      icon: '📋',
    });
    // navigate(`/groups/${group.id}/details`);
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    setIsAcceptingInvitation(true);

    try {
      // TODO: Implement API call
      // await acceptInvitation(invitationId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update invitation status
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId ? { ...inv, status: InvitationStatus.ACCEPTED } : inv
        )
      );

      toast.success('Invitación aceptada exitosamente');

      // TODO: Reload groups after accepting invitation
      // await loadGroups();
    } catch (err) {
      toast.error('Error al aceptar la invitación');
      console.error('Error accepting invitation:', err);
    } finally {
      setIsAcceptingInvitation(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setIsAcceptingInvitation(true);

    try {
      // TODO: Implement API call
      // await declineInvitation(invitationId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update invitation status
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId ? { ...inv, status: InvitationStatus.DECLINED } : inv
        )
      );

      toast.success('Invitación rechazada');
    } catch (err) {
      toast.error('Error al rechazar la invitación');
      console.error('Error declining invitation:', err);
    } finally {
      setIsAcceptingInvitation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <DashboardHeader
          userName={userName}
          onCreateGroup={handleOpenCreateModal}
          onJoinGroup={handleOpenJoinModal}
        />

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onDismiss={() => {
                // TODO: Implement clearError from useGroups hook
              }}
            />
          </div>
        )}

        {/* Invitations Section with History Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                {showInvitationHistory ? 'Historial de Invitaciones' : 'Invitaciones Pendientes'}
              </h2>
              {!showInvitationHistory && (
                <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  {invitations.filter(
                    (inv) =>
                      inv.status === InvitationStatus.PENDING &&
                      new Date(inv.expiresIn) > new Date()
                  ).length}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowInvitationHistory(!showInvitationHistory)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              {showInvitationHistory ? 'Ver Pendientes' : 'Ver Historial'}
            </button>
          </div>

          {showInvitationHistory ? (
            <InvitationHistory invitations={invitations} loading={loading} />
          ) : (
            <InvitationsList
              invitations={invitations}
              onAccept={handleAcceptInvitation}
              onDecline={handleDeclineInvitation}
              loading={loading}
              actionLoading={isAcceptingInvitation}
            />
          )}
        </div>

        {/* Groups Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Mis Grupos
            </h2>
            {selectedGroup && (
              <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                Grupo activo: <span className="font-semibold text-primary">{selectedGroup.name}</span>
              </span>
            )}
          </div>
          <GroupsList
            groups={groups}
            onViewDetails={handleViewDetails}
            onSelectGroup={handleSelectGroup}
            selectedGroupId={selectedGroup?.id}
            loading={loading}
          />
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateGroup={handleCreateGroup}
          isLoading={isCreating}
        />

        {/* Join Group Modal */}
        <JoinGroupModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinGroup={handleJoinGroup}
          isLoading={isJoining}
        />
      </main>
    </div>
  );
};
