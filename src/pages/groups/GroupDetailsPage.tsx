import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Users, Settings, UserPlus, Send, Shield, Plus, Trash2, Edit3, LogOut, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateRoleModal, DeleteRoleModal, RenameGroupModal, LeaveGroupModal, InviteUserModal } from '@/components/features/groups';
import { useGroupDetails } from '@/hooks/useGroupDetails';
import { useUser } from '@/hooks/useUser';
import { useGroups } from '@/hooks/useGroups';
import type { PermsConfig } from '@/types/groups.types';

export const GroupDetailsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'solicitations' | 'invitations' | 'settings'>('members');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
  const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<string | null>(null);
  const [selectedSolicitationForRole, setSelectedSolicitationForRole] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [groupName, setGroupName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isRenamingGroup, setIsRenamingGroup] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [isInvitingUser, setIsInvitingUser] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showSolicitationHistory, setShowSolicitationHistory] = useState(false);
  const [showInvitationHistory, setShowInvitationHistory] = useState(false);
  const [solicitationStatusFilter, setSolicitationStatusFilter] = useState<number | 'all'>('all');
  const [invitationStatusFilter, setInvitationStatusFilter] = useState<number | 'all'>('all');

  const { userInfo, refreshUserInfo } = useUser();
  const { renameGroup, leaveGroup, selectedGroup, groups } = useGroups();
  const {
    isLoading,
    members,
    solicitations,
    invitations,
    roles,
    createRole,
    reassignRole,
    deleteRole,
    inviteUser,
    acceptJoinSolicitation,
    declineJoinSolicitation,
    cancelInvitation,
    clearError,
  } = useGroupDetails(groupId);

  // Load user information on mount
  useEffect(() => {
    refreshUserInfo();
  }, []);

  // Set group name from selected group
  useEffect(() => {
    if (selectedGroup && selectedGroup.id === groupId) {
      setGroupName(selectedGroup.name);
    }
  }, [selectedGroup, groupId]);

  // Get current group data
  const currentGroup = groups.find(g => g.id === groupId);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCopyCode = async () => {
    if (currentGroup?.unionCode) {
      try {
        await navigator.clipboard.writeText(currentGroup.unionCode);
        setCodeCopied(true);
        toast.success('Código copiado al portapapeles');
        setTimeout(() => setCodeCopied(false), 2000);
      } catch (error) {
        toast.error('Error al copiar el código');
      }
    }
  };

  const handleCreateRole = async (roleName: string, permissions: PermsConfig) => {
    if (!groupId) return;

    // Prevent creating "Admin" role
    if (roleName.toLowerCase() === 'admin') {
      toast.error('No se puede crear un rol llamado "Admin". Este nombre está reservado.');
      return;
    }

    setIsCreatingRole(true);
    clearError();

    try {
      await createRole({
        idGroup: groupId,
        rolName: roleName,
        permsConfig: permissions,
      });

      // Only close modal and show success if no error occurred
      toast.success(`Rol "${roleName}" creado exitosamente`);
      setShowCreateRoleModal(false);
    } catch (error: any) {
      // Show error toast but keep modal open
      const errorMessage = error?.message || 'Error al crear el rol';
      toast.error(errorMessage);
      // Modal stays open so user can fix the issue
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleReassignRole = async (userId: string, roleId: string) => {
    if (!groupId) return;

    try {
      await reassignRole({
        to: userId,
        rolId: roleId,
        groupId: groupId,
      });

      toast.success('Rol reasignado exitosamente');
      setSelectedMemberForRole(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al reasignar el rol');
    }
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setShowDeleteRoleModal(true);
  };

  const confirmDeleteRole = async () => {
    if (!groupId || !roleToDelete) return;

    setIsDeletingRole(true);

    try {
      await deleteRole(roleToDelete.id);
      toast.success(`Rol "${roleToDelete.name}" eliminado exitosamente`);
      setShowDeleteRoleModal(false);
      setRoleToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar el rol');
    } finally {
      setIsDeletingRole(false);
    }
  };

  const handleRenameGroup = async (newName: string) => {
    if (!groupId) return;

    setIsRenamingGroup(true);

    try {
      await renameGroup(groupId, newName);
      toast.success('Grupo renombrado exitosamente');
      setGroupName(newName);
      setShowRenameGroupModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Error al renombrar el grupo');
    } finally {
      setIsRenamingGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;

    setIsLeavingGroup(true);

    try {
      await leaveGroup(groupId);
      toast.success('Has salido del grupo exitosamente');
      setShowLeaveGroupModal(false);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Error al salir del grupo');
      setIsLeavingGroup(false);
    }
  };

  const handleInviteUser = async (userId: string, roleId: string, expiresIn: Date) => {
    if (!groupId) return;

    setIsInvitingUser(true);
    clearError();

    try {
      await inviteUser(userId, roleId, expiresIn);
      toast.success('Invitación enviada exitosamente');
      setShowInviteUserModal(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al enviar la invitación';
      toast.error(errorMessage);
    } finally {
      setIsInvitingUser(false);
    }
  };

  const handleAcceptSolicitation = async (solicitationId: string, roleId: string) => {
    try {
      await acceptJoinSolicitation(solicitationId, roleId);
      toast.success('Solicitud aceptada exitosamente');
      setSelectedSolicitationForRole(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al aceptar la solicitud');
    }
  };

  const handleDeclineSolicitation = async (solicitationId: string) => {
    try {
      await declineJoinSolicitation(solicitationId);
      toast.success('Solicitud rechazada');
      setSelectedSolicitationForRole(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al rechazar la solicitud');
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitation(invitationId);
      toast.success('Invitación cancelada');
    } catch (error: any) {
      toast.error(error?.message || 'Error al cancelar la invitación');
    }
  };

  if (!groupId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Grupos
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Detalles del Grupo
            </h1>
            <p className="text-gray-600 mb-4">
              Administra los miembros, solicitudes e invitaciones del grupo
            </p>

            {/* Group Code */}
            {currentGroup?.unionCode && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">Código del Grupo</p>
                  <p className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                    {currentGroup.unionCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {codeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                Miembros ({members.length})
              </button>
              <button
                onClick={() => setActiveTab('solicitations')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'solicitations'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Send className="w-4 h-4" />
                Solicitudes ({solicitations.filter(s => s.status === 0).length})
              </button>
              <button
                onClick={() => setActiveTab('invitations')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'invitations'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Invitaciones ({invitations.filter(i => i.status === 0).length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                Configuración
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {activeTab === 'members' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Miembros del Grupo</h2>
                    {members.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay miembros en este grupo</p>
                    ) : (
                      <div className="space-y-3">
                        {members.map((member) => {
                          const isCurrentUser = userInfo?.email === member.email;
                          const isExpanded = selectedMemberForRole === member.id;

                          return (
                            <div key={member.id} className="bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrentUser ? 'bg-primary/10' : 'bg-gray-200'}`}>
                                    <span className="text-sm font-semibold text-gray-700">
                                      {member.full_name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-900">{member.full_name}</p>
                                      {isCurrentUser && (
                                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                                          Tú
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedMemberForRole(isExpanded ? null : member.id)}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                  <Settings className="w-4 h-4" />
                                  {isExpanded ? 'Cerrar' : 'Reasignar Rol'}
                                </button>
                              </div>

                              {/* Role Assignment Section */}
                              {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-200 pt-3 mt-2">
                                  <p className="text-sm font-medium text-gray-700 mb-3">
                                    Seleccionar nuevo rol para {member.full_name}:
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {roles
                                      .filter((role) => role.rolName.toLowerCase() !== 'admin')
                                      .map((role) => (
                                        <button
                                          key={role.id}
                                          onClick={() => handleReassignRole(member.id, role.id)}
                                          className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                                        >
                                          <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                                          <span className="text-sm font-medium text-gray-900">
                                            {role.rolName}
                                          </span>
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'solicitations' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          {showSolicitationHistory ? 'Historial de Solicitudes' : 'Solicitudes de Unión'}
                        </h2>
                        {!showSolicitationHistory && (
                          <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                            {solicitations.filter(s => s.status === 0).length}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setShowSolicitationHistory(!showSolicitationHistory);
                          setSolicitationStatusFilter('all');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        {showSolicitationHistory ? 'Ver Pendientes' : 'Ver Historial'}
                      </button>
                    </div>

                    {/* Filter Buttons (only show in history mode) */}
                    {showSolicitationHistory && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={() => setSolicitationStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            solicitationStatusFilter === 'all'
                              ? 'ring-2 ring-primary ring-offset-1 bg-gray-100 text-gray-700'
                              : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Todas ({solicitations.length})
                        </button>
                        <button
                          onClick={() => setSolicitationStatusFilter(0)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            solicitationStatusFilter === 0
                              ? 'ring-2 ring-primary ring-offset-1 bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'border-transparent bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                          }`}
                        >
                          Pendientes ({solicitations.filter(s => s.status === 0).length})
                        </button>
                        <button
                          onClick={() => setSolicitationStatusFilter(1)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            solicitationStatusFilter === 1
                              ? 'ring-2 ring-primary ring-offset-1 bg-green-50 text-green-700 border-green-200'
                              : 'border-transparent bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          Aceptadas ({solicitations.filter(s => s.status === 1).length})
                        </button>
                        <button
                          onClick={() => setSolicitationStatusFilter(2)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            solicitationStatusFilter === 2
                              ? 'ring-2 ring-primary ring-offset-1 bg-red-50 text-red-700 border-red-200'
                              : 'border-transparent bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Rechazadas ({solicitations.filter(s => s.status === 2).length})
                        </button>
                      </div>
                    )}

                    {(() => {
                      const filteredSolicitations = showSolicitationHistory
                        ? solicitations.filter(s =>
                            solicitationStatusFilter === 'all' ? true : s.status === solicitationStatusFilter
                          )
                        : solicitations.filter(s => s.status === 0);

                      return filteredSolicitations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          {showSolicitationHistory
                            ? 'No hay solicitudes'
                            : 'No hay solicitudes pendientes'}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {filteredSolicitations.map((solicitation) => {
                            const isExpanded = selectedSolicitationForRole === solicitation.id;

                            const isPending = solicitation.status === 0;
                            const isAccepted = solicitation.status === 1;
                            const isDeclined = solicitation.status === 2;

                            return (
                              <div
                                key={solicitation.id}
                                className={`rounded-lg ${
                                  isPending ? 'bg-yellow-50 border border-yellow-200' :
                                  isAccepted ? 'bg-green-50 border border-green-200' :
                                  isDeclined ? 'bg-red-50 border border-red-200' :
                                  'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between p-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-gray-900">Usuario: {solicitation.idUser}</p>
                                      {isPending && (
                                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded-full">
                                          Pendiente
                                        </span>
                                      )}
                                      {isAccepted && (
                                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                                          Aceptada
                                        </span>
                                      )}
                                      {isDeclined && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                                          Rechazada
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500">Grupo: {solicitation.group.name}</p>
                                  </div>
                                  {!showSolicitationHistory && isPending && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleDeclineSolicitation(solicitation.id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                      >
                                        Rechazar
                                      </button>
                                      <button
                                        onClick={() => setSelectedSolicitationForRole(isExpanded ? null : solicitation.id)}
                                        className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                      >
                                        {isExpanded ? 'Cancelar' : 'Aceptar'}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Role Selection Section */}
                                {isExpanded && !showSolicitationHistory && isPending && (
                                  <div className="px-4 pb-4 border-t border-gray-200 pt-3 mt-2">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                      Seleccionar rol para el nuevo miembro:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {roles
                                        .filter((role) => role.rolName.toLowerCase() !== 'admin')
                                        .map((role) => (
                                          <button
                                            key={role.id}
                                            onClick={() => handleAcceptSolicitation(solicitation.id, role.id)}
                                            className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                                          >
                                            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-900">
                                              {role.rolName}
                                            </span>
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      );
                    })()}
                  </div>
                )}

                {activeTab === 'invitations' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          {showInvitationHistory ? 'Historial de Invitaciones' : 'Invitaciones Enviadas'}
                        </h2>
                        {!showInvitationHistory && (
                          <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                            {invitations.filter(i => i.status === 0).length}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowInvitationHistory(!showInvitationHistory);
                            setInvitationStatusFilter('all');
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          {showInvitationHistory ? 'Ver Pendientes' : 'Ver Historial'}
                        </button>
                        <button
                          onClick={() => setShowInviteUserModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Invitar Persona
                        </button>
                      </div>
                    </div>

                    {/* Filter Buttons (only show in history mode) */}
                    {showInvitationHistory && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={() => setInvitationStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            invitationStatusFilter === 'all'
                              ? 'ring-2 ring-primary ring-offset-1 bg-gray-100 text-gray-700'
                              : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Todas ({invitations.length})
                        </button>
                        <button
                          onClick={() => setInvitationStatusFilter(0)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            invitationStatusFilter === 0
                              ? 'ring-2 ring-primary ring-offset-1 bg-amber-50 text-amber-700 border-amber-200'
                              : 'border-transparent bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                        >
                          Pendientes ({invitations.filter(i => i.status === 0).length})
                        </button>
                        <button
                          onClick={() => setInvitationStatusFilter(1)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            invitationStatusFilter === 1
                              ? 'ring-2 ring-primary ring-offset-1 bg-green-50 text-green-700 border-green-200'
                              : 'border-transparent bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          Aceptadas ({invitations.filter(i => i.status === 1).length})
                        </button>
                        <button
                          onClick={() => setInvitationStatusFilter(2)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            invitationStatusFilter === 2
                              ? 'ring-2 ring-primary ring-offset-1 bg-red-50 text-red-700 border-red-200'
                              : 'border-transparent bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Rechazadas ({invitations.filter(i => i.status === 2).length})
                        </button>
                      </div>
                    )}

                    {(() => {
                      const filteredInvitations = showInvitationHistory
                        ? invitations.filter(i =>
                            invitationStatusFilter === 'all' ? true : i.status === invitationStatusFilter
                          )
                        : invitations.filter(i => i.status === 0);

                      console.log('Invitations tab - Total invitations:', invitations.length);
                      console.log('Invitations tab - Show history:', showInvitationHistory);
                      console.log('Invitations tab - Filter:', invitationStatusFilter);
                      console.log('Invitations tab - Filtered count:', filteredInvitations.length);
                      console.log('Invitations tab - All invitations:', invitations);
                      console.log('Invitations tab - Filtered invitations:', filteredInvitations);

                      return filteredInvitations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          {showInvitationHistory
                            ? 'No hay invitaciones'
                            : 'No hay invitaciones pendientes'}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {filteredInvitations.map((invitation) => {
                          // Parse the expiration date safely
                          let expirationDate = null;
                          try {
                            if (invitation.expiresIn) {
                              // Handle both "2025-10-25" and full ISO format
                              expirationDate = new Date(invitation.expiresIn);
                              // Check if date is valid
                              if (isNaN(expirationDate.getTime())) {
                                expirationDate = null;
                              }
                            }
                          } catch (e) {
                            console.error('Error parsing expiration date:', e);
                            expirationDate = null;
                          }

                          // Parse creation date safely
                          let creationDate = null;
                          try {
                            if (invitation.createdAt) {
                              creationDate = new Date(invitation.createdAt);
                              if (isNaN(creationDate.getTime())) {
                                creationDate = null;
                              }
                            }
                          } catch (e) {
                            console.error('Error parsing creation date:', e);
                            creationDate = null;
                          }

                          const isExpired = expirationDate ? expirationDate < new Date() : false;
                          const isPending = invitation.status === 0;
                          const isAccepted = invitation.status === 1;
                          const isDeclined = invitation.status === 2;

                          return (
                            <div
                              key={invitation.id}
                              className={`rounded-lg ${
                                isPending ? 'bg-amber-50 border border-amber-200' :
                                isAccepted ? 'bg-green-50 border border-green-200' :
                                isDeclined ? 'bg-red-50 border border-red-200' :
                                'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-start gap-2 flex-1">
                                    <p className="font-medium text-gray-900">
                                      Usuario: <span className="font-mono text-sm">{invitation.toUser || 'N/A'}</span>
                                    </p>
                                    {isPending && (
                                      <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                                        Pendiente
                                      </span>
                                    )}
                                    {isAccepted && (
                                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                                        Aceptada
                                      </span>
                                    )}
                                    {isDeclined && (
                                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                                        Rechazada
                                      </span>
                                    )}
                                    {isExpired && isPending && (
                                      <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                                        Expirada
                                      </span>
                                    )}
                                  </div>
                                  {isPending && !showInvitationHistory && (
                                    <button
                                      onClick={() => handleCancelInvitation(invitation.id)}
                                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                </div>
                                {invitation.rol && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Rol asignado: <span className="font-medium">{invitation.rol.rolName}</span>
                                  </p>
                                )}
                                {expirationDate && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {isExpired ? 'Expiró' : 'Expira'}: {expirationDate.toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                )}
                                {creationDate && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Enviada: {creationDate.toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      );
                    })()}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    {/* Group Settings Section */}
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold mb-4">Configuración del Grupo</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Rename Group Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Edit3 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">Renombrar Grupo</h3>
                              <p className="text-sm text-gray-500 mb-3">
                                Cambia el nombre del grupo
                              </p>
                              <button
                                onClick={() => setShowRenameGroupModal(true)}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                              >
                                Renombrar →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Leave Group Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <LogOut className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">Salir del Grupo</h3>
                              <p className="text-sm text-gray-500 mb-3">
                                Abandona este grupo permanentemente
                              </p>
                              <button
                                onClick={() => setShowLeaveGroupModal(true)}
                                className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                              >
                                Salir del Grupo →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Roles Section */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Gestión de Roles
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Administra los roles y permisos del grupo
                        </p>
                      </div>
                      <button
                        onClick={() => setShowCreateRoleModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Crear Rol
                      </button>
                    </div>

                    {roles.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No hay roles configurados</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Crea roles para asignar permisos a los miembros
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {roles.map((role) => {
                          const perms = role.permsConfig || {
                            invitePeople: false,
                            kickPeople: false,
                            createTask: false,
                            deleteTask: false,
                            updateTask: false,
                            createInventory: false,
                            deleteInventory: false,
                            updateInventory: false,
                            createFinances: false,
                            deleteFinances: false,
                            updateFinances: false,
                            createRol: false,
                            editable: false,
                            updateRol: false,
                          };

                          return (
                          <div
                            key={role.id}
                            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{role.rolName}</h3>
                                  <p className="text-sm text-gray-500">
                                    {perms.editable ? 'Rol editable' : 'Rol del sistema'}
                                  </p>
                                </div>
                              </div>
                              {perms.editable && (
                                <button
                                  onClick={() => handleDeleteRole(role.id, role.rolName)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {/* People Permissions */}
                              <PermissionBadge
                                label="Invitar personas"
                                enabled={perms.invitePeople}
                              />
                              <PermissionBadge
                                label="Expulsar personas"
                                enabled={perms.kickPeople}
                              />

                              {/* Task Permissions */}
                              <PermissionBadge
                                label="Crear tareas"
                                enabled={perms.createTask}
                              />
                              <PermissionBadge
                                label="Eliminar tareas"
                                enabled={perms.deleteTask}
                              />
                              <PermissionBadge
                                label="Actualizar tareas"
                                enabled={perms.updateTask}
                              />

                              {/* Inventory Permissions */}
                              <PermissionBadge
                                label="Crear inventario"
                                enabled={perms.createInventory}
                              />
                              <PermissionBadge
                                label="Eliminar inventario"
                                enabled={perms.deleteInventory}
                              />
                              <PermissionBadge
                                label="Actualizar inventario"
                                enabled={perms.updateInventory}
                              />

                              {/* Finance Permissions */}
                              <PermissionBadge
                                label="Crear finanzas"
                                enabled={perms.createFinances}
                              />
                              <PermissionBadge
                                label="Eliminar finanzas"
                                enabled={perms.deleteFinances}
                              />
                              <PermissionBadge
                                label="Actualizar finanzas"
                                enabled={perms.updateFinances}
                              />

                              {/* Role Permissions */}
                              <PermissionBadge
                                label="Crear roles"
                                enabled={perms.createRol}
                              />
                              <PermissionBadge
                                label="Actualizar roles"
                                enabled={perms.updateRol}
                              />
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Create Role Modal */}
        <CreateRoleModal
          isOpen={showCreateRoleModal}
          onClose={() => {
            setShowCreateRoleModal(false);
            clearError();
          }}
          onCreateRole={handleCreateRole}
          isLoading={isCreatingRole}
        />

        {/* Delete Role Modal */}
        <DeleteRoleModal
          isOpen={showDeleteRoleModal}
          onClose={() => {
            setShowDeleteRoleModal(false);
            setRoleToDelete(null);
          }}
          onConfirm={confirmDeleteRole}
          roleName={roleToDelete?.name || ''}
          isLoading={isDeletingRole}
        />

        {/* Rename Group Modal */}
        <RenameGroupModal
          isOpen={showRenameGroupModal}
          onClose={() => setShowRenameGroupModal(false)}
          onRename={handleRenameGroup}
          currentName={currentGroup?.name || groupName}
          isLoading={isRenamingGroup}
        />

        {/* Leave Group Modal */}
        <LeaveGroupModal
          isOpen={showLeaveGroupModal}
          onClose={() => setShowLeaveGroupModal(false)}
          onConfirm={handleLeaveGroup}
          groupName={currentGroup?.name || groupName || 'este grupo'}
          isLoading={isLeavingGroup}
        />

        {/* Invite User Modal */}
        <InviteUserModal
          isOpen={showInviteUserModal}
          onClose={() => {
            setShowInviteUserModal(false);
            clearError();
          }}
          onInviteUser={handleInviteUser}
          roles={roles}
          isLoading={isInvitingUser}
        />
      </main>
    </div>
  );
};

// Helper component for permission badges
const PermissionBadge: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
  <div
    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      enabled
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-500'
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          enabled ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      {label}
    </div>
  </div>
);
