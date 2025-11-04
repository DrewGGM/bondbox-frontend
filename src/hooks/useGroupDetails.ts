import { useState, useEffect } from 'react';
import { GroupsServiceImp } from '@/api/services/groupService';
import { useGroups } from './useGroups';
import type {
  UsersGroupInformation,
  JoinSolicitationResponse,
  InvitationResponse,
  RolInfo,
  RolInfoCreate,
  ReasingRol
} from '@/types/groups.types';

export const useGroupDetails = (groupId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<UsersGroupInformation[]>([]);
  const [solicitations, setSolicitations] = useState<JoinSolicitationResponse[]>([]);
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [roles, setRoles] = useState<RolInfo[]>([]);

  const groupService = new GroupsServiceImp();
  const { createRol: createRolHook, reassignRol: reassignRolHook, deleteRol: deleteRolHook, error, clearError } = useGroups();

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    if (!groupId) return;

    try {
      setIsLoading(true);
      const [membersData, solicitationsData, invitationsData, rolesData] = await Promise.all([
        groupService.getUsersGroup(groupId),
        groupService.getJoinSolicitationByGroup(groupId),
        groupService.getInvitationByGroupId(groupId),
        groupService.getRolesByGroup(groupId),
      ]);

      setMembers(membersData);
      setSolicitations(solicitationsData);
      setInvitations(invitationsData);
      setRoles(rolesData);
    } catch (error: any) {
      console.error('Error loading group data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (data: RolInfoCreate) => {
    await createRolHook(data);
    await loadGroupData(); // Reload to get the new role
  };

  const reassignRole = async (data: ReasingRol) => {
    await reassignRolHook(data);
    await loadGroupData(); // Reload to reflect changes
  };

  const deleteRole = async (rolId: string) => {
    if (!groupId) return;
    await deleteRolHook(groupId, rolId);
    await loadGroupData(); // Reload to reflect changes
  };

  return {
    isLoading,
    members,
    solicitations,
    invitations,
    roles,
    error,
    loadGroupData,
    createRole,
    reassignRole,
    deleteRole,
    clearError,
  };
};
