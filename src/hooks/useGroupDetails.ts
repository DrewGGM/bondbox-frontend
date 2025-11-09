import { useState, useEffect } from 'react';
import { GroupsServiceImp } from '@/api/services/groupService';
import { useGroups } from './useGroups';
import type {
  UsersGroupInformation,
  JoinSolicitationResponse,
  InvitationResponse,
  RolInfo,
  RolInfoCreate,
  ReasingRol,
  CreateInvitation,
  AcceptJoinSolicitation,
  DeclineJoinSolicitation
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

      // Use allSettled to allow partial success - if one endpoint fails, others can still succeed
      const results = await Promise.allSettled([
        groupService.getUsersGroup(groupId),
        groupService.getJoinSolicitationByGroup(groupId),
        groupService.getInvitationByGroupId(groupId),
        groupService.getRolesByGroup(groupId),
      ]);

      // Extract data from successful calls, use empty arrays for failed ones
      const membersData = results[0].status === 'fulfilled' ? results[0].value : [];
      const solicitationsData = results[1].status === 'fulfilled' ? results[1].value : [];
      const invitationsData = results[2].status === 'fulfilled' ? results[2].value : [];
      const rolesData = results[3].status === 'fulfilled' ? results[3].value : [];

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const endpoint = ['members', 'solicitations', 'invitations', 'roles'][index];
          console.warn(`Failed to load ${endpoint}:`, result.reason);
        }
      });

      console.log('Setting state with data:', {
        members: membersData,
        membersCount: membersData.length,
        solicitations: solicitationsData,
        solicitationsCount: solicitationsData.length,
        invitations: invitationsData,
        invitationsCount: invitationsData.length,
        roles: rolesData,
        rolesCount: rolesData.length
      });

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

  const inviteUser = async (userId: string, roleId: string, expiresIn: Date) => {
    if (!groupId) return;

    // Convert Date to ISO string format: 2026-10-25T13:09:42.912Z
    const invitationData: CreateInvitation = {
      toUser: userId,
      idGroup: groupId,
      initialRol: roleId,
      expiresIn: expiresIn, // Will be serialized to ISO string by axios
    };

    console.log('Sending invitation with expiration:', expiresIn.toISOString()); // Debug log

    await groupService.createInvitation(invitationData);
    await loadGroupData(); // Reload to get the new invitation
  };

  const acceptJoinSolicitation = async (solicitationId: string, roleId: string) => {
    const data: AcceptJoinSolicitation = {
      id: solicitationId,
      rolId: roleId,
    };

    await groupService.acceptJoinSolicitation(data);
    await loadGroupData(); // Reload to update the solicitations list
  };

  const declineJoinSolicitation = async (solicitationId: string) => {
    const data: DeclineJoinSolicitation = {
      id: solicitationId,
    };

    await groupService.declineJoinSolicitation(data);
    await loadGroupData(); // Reload to update the solicitations list
  };

  const cancelInvitation = async (invitationId: string) => {
    await groupService.cancelInvitation(invitationId);
    await loadGroupData(); // Reload to update the invitations list
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
    inviteUser,
    acceptJoinSolicitation,
    declineJoinSolicitation,
    cancelInvitation,
    clearError,
  };
};
