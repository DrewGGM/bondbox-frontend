import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import {
  DashboardHeader,
  GroupsList,
  InvitationsList,
  InvitationHistory,
  JoinSolicitationsList,
  JoinSolicitationHistory,
  CreateGroupModal,
  JoinGroupModal,
  Group,
  Invitation,
  InvitationStatus,
  JoinSolicitation,
  JoinSolicitationStatus,
} from '@/components/features/groups';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useGroupStore } from '@/store/groupStore';
import { History, Search } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useGroups } from '@/hooks/useGroups';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);
  const [showJoinSolicitationHistory, setShowJoinSolicitationHistory] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Track operations to show appropriate success messages
  const [operationInProgress, setOperationInProgress] = useState<
    'creating' | 'joining' | 'accepting' | 'declining' | 'cancelling' | null
  >(null);
  const [pendingGroupName, setPendingGroupName] = useState<string>('');

  const { userInfo, refreshUserInfo } = useUser();

  const {
    isLoading,
    error,
    groups: groupsData,
    invitations: invitationsData,
    joinSolicitations: joinSolicitationsData,
    createGroup: createGroupAction,
    joinGroupByCode,
    acceptInvitation: acceptInvitationAction,
    declineInvitation: declineInvitationAction,
    cancelJoinSolicitation: cancelJoinSolicitationAction,
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

  // Handle cancel solicitation success/error
  useEffect(() => {
    if (operationInProgress === 'cancelling' && !isLoading) {
      if (!error) {
        toast.success('Solicitud cancelada exitosamente');
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

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) {
      return groups;
    }
    return groups.filter((group) =>
      group.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
    );
  }, [groups, groupSearchQuery]);

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

  const joinSolicitations: JoinSolicitation[] = useMemo(() => {
    return joinSolicitationsData.map((sol) => ({
      id: sol.id,
      idUser: sol.idUser,
      status: sol.status as JoinSolicitationStatus,
      groupName: sol.group.name,
      groupId: sol.group.id,
      createdAt: (sol as any).createdAt?.toString(),
    }));
  }, [joinSolicitationsData]);

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
    navigate(`/grupos/${group.id}`);
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

  const handleCancelJoinSolicitation = async (solicitationId: string) => {
    clearError();
    setOperationInProgress('cancelling');

    await cancelJoinSolicitationAction(solicitationId);
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

        {/* Join Solicitations Section with History Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                {showJoinSolicitationHistory ? 'Historial de Solicitudes' : 'Solicitudes de Unión Pendientes'}
              </h2>
              {!showJoinSolicitationHistory && (
                <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  {joinSolicitations.filter(
                    (sol) => sol.status === JoinSolicitationStatus.PENDING
                  ).length}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowJoinSolicitationHistory(!showJoinSolicitationHistory)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              {showJoinSolicitationHistory ? 'Ver Pendientes' : 'Ver Historial'}
            </button>
          </div>

          {showJoinSolicitationHistory ? (
            <JoinSolicitationHistory solicitations={joinSolicitations} loading={isLoading} />
          ) : (
            <JoinSolicitationsList
              solicitations={joinSolicitations}
              onCancel={handleCancelJoinSolicitation}
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

          {/* Search Bar */}
          {groups.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  placeholder="Buscar grupos por nombre..."
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          )}

          <GroupsList
            groups={filteredGroups}
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
