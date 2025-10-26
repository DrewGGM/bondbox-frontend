import React, { useEffect, useState, useMemo } from 'react';
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
import { useGroups } from '@/hooks/useGroups';

export const DashboardPage: React.FC = () => {

  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);

  // Track operations to show appropriate success messages
  const [operationInProgress, setOperationInProgress] = useState<
    'creating' | 'joining' | 'accepting' | 'declining' | null
  >(null);
  const [pendingGroupName, setPendingGroupName] = useState<string>('');

  const { userInfo, refreshUserInfo } = useUser();

  const {
    isLoading,
    error,
    groups: groupsData,
    invitations: invitationsData,
    createGroup: createGroupAction,
    joinGroupByCode,
    acceptInvitation: acceptInvitationAction,
    declineInvitation: declineInvitationAction,
    clearError,
  } = useGroups();

  useEffect(() => {
    // Fetch user info only once
    refreshUserInfo();
  }, []);

  // Handle create group success/error
  useEffect(() => {
    if (operationInProgress === 'creating' && !isLoading) {
      if (!error) {
        toast.success(`Grupo "${pendingGroupName}" creado exitosamente`);
        setShowCreateModal(false);
        setPendingGroupName('');
      } else {
        toast.error(error);
      }
      setOperationInProgress(null);
    }
  }, [operationInProgress, isLoading, error, pendingGroupName]);

  // Handle join group success/error
  useEffect(() => {
    if (operationInProgress === 'joining' && !isLoading) {
      if (!error) {
        toast.success('Solicitud de unión enviada exitosamente', {
          icon: '✉️',
          duration: 4000,
        });
        setShowJoinModal(false);
      } else {
        toast.error(error);
      }
      setOperationInProgress(null);
    }
  }, [operationInProgress, isLoading, error]);

  // Handle accept invitation success/error
  useEffect(() => {
    if (operationInProgress === 'accepting' && !isLoading) {
      if (!error) {
        toast.success('Invitación aceptada exitosamente');
      } else {
        toast.error(error);
      }
      setOperationInProgress(null);
    }
  }, [operationInProgress, isLoading, error]);

  // Handle decline invitation success/error
  useEffect(() => {
    if (operationInProgress === 'declining' && !isLoading) {
      if (!error) {
        toast.success('Invitación rechazada');
      } else {
        toast.error(error);
      }
      setOperationInProgress(null);
    }
  }, [operationInProgress, isLoading, error]);

  // Transform API data to component format
  const groups: Group[] = useMemo(() => {
    return groupsData.map((g) => ({
      id: g.id,
      name: g.name,
      memberCount: g.members,
    }));
  }, [groupsData]);

  const invitations: Invitation[] = useMemo(() => {
    return invitationsData.map((inv) => ({
      id: inv.id,
      createdAt: inv.createdAt.toString(),
      expiresIn: inv.expiresIn.toString(),
      status: inv.status as InvitationStatus,
      fromUser: inv.fromUser,
      toUser: inv.toUser,
      idGroup: inv.group.id,
      rol: inv.rol,
      groupName: inv.group.name,
      fromUserName: undefined, // API doesn't provide this yet
    }));
  }, [invitationsData]);

  const userName = userInfo?.full_name || "User";

  const handleCreateGroup = async (name: string) => {
    clearError();
    setPendingGroupName(name);
    setOperationInProgress('creating');

    await createGroupAction(name);
  };

  const handleJoinGroup = async (code: string) => {
    clearError();
    setOperationInProgress('joining');

    await joinGroupByCode(code);
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
    clearError();
    setOperationInProgress('accepting');

    await acceptInvitationAction(invitationId);
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    clearError();
    setOperationInProgress('declining');

    await declineInvitationAction(invitationId);
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
              onDismiss={clearError}
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
            <InvitationHistory invitations={invitations} loading={isLoading} />
          ) : (
            <InvitationsList
              invitations={invitations}
              onAccept={handleAcceptInvitation}
              onDecline={handleDeclineInvitation}
              loading={isLoading}
              actionLoading={isLoading}
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
            loading={isLoading}
          />
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateGroup={handleCreateGroup}
          isLoading={isLoading}
        />

        {/* Join Group Modal */}
        <JoinGroupModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinGroup={handleJoinGroup}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};
