import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Users, Settings, UserPlus, Send, Shield, Plus, Trash2, Edit3, LogOut, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateRoleModal, DeleteRoleModal, RenameGroupModal, LeaveGroupModal } from '@/components/features/groups';
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
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<string | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);
  const [groupName, setGroupName] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isRenamingGroup, setIsRenamingGroup] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

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
                    <h2 className="text-lg font-semibold mb-4">Solicitudes de Unión</h2>
                    {solicitations.filter(s => s.status === 0).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay solicitudes pendientes</p>
                    ) : (
                      <div className="space-y-3">
                        {solicitations
                          .filter(s => s.status === 0)
                          .map((solicitation) => (
                            <div
                              key={solicitation.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">Usuario: {solicitation.idUser}</p>
                                <p className="text-sm text-gray-500">Grupo: {solicitation.group.name}</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                                  Rechazar
                                </button>
                                <button className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                                  Aceptar
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'invitations' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Invitaciones Enviadas</h2>
                    {invitations.filter(i => i.status === 0).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay invitaciones pendientes</p>
                    ) : (
                      <div className="space-y-3">
                        {invitations
                          .filter(i => i.status === 0)
                          .map((invitation) => (
                            <div
                              key={invitation.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">Para: {invitation.toUser}</p>
                                <p className="text-sm text-gray-500">
                                  Expira: {new Date(invitation.expiresIn).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
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
          currentName={groupName}
          isLoading={isRenamingGroup}
        />

        {/* Leave Group Modal */}
        <LeaveGroupModal
          isOpen={showLeaveGroupModal}
          onClose={() => setShowLeaveGroupModal(false)}
          onConfirm={handleLeaveGroup}
          groupName={groupName}
          isLoading={isLeavingGroup}
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
