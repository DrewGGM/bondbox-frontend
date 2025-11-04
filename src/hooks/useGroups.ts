import { GroupService, GroupsServiceImp } from "@/api/services/groupService";
import { useGroupStore } from "@/store/groupStore";
import { GroupInformation, InvitationResponse, JoinSolicitationResponse, RolInfoCreate, ReasingRol } from "@/types/groups.types";
import { useEffect, useState } from "react";
import {
    validateCreateGroup,
    validateJoinGroupByCode,
    validateGroupId,
    validateInvitationId,
} from "@/schemas";

export interface UseGroupsActions {
    isLoading: boolean;
    error: string | undefined;
    groups: GroupInformation[];
    invitations: InvitationResponse[];
    joinSolicitations: JoinSolicitationResponse[];
    selectedGroup: { id: string; name: string; memberCount?: number } | null;

    createGroup(name: string): void;
    renameGroup(groupId: string, name: string): void;
    leaveGroup(groupId: string): void;
    joinGroupByCode(code: string): void;
    acceptInvitation(invitationId: string): void;
    declineInvitation(invitationId: string): void;
    cancelInvitation(invitationId: string): void;
    cancelJoinSolicitation(solicitationId: string): void;
    createRol(data: RolInfoCreate): void;
    reassignRol(data: ReasingRol): void;
    deleteRol(groupId: string, rolId: string): void;
    refreshGroups(): void;
    refreshInvitations(): void;
    refreshJoinSolicitations(): void;
    clearError(): void;
}

export const useGroups = (): UseGroupsActions => {
    const groupService: GroupService = new GroupsServiceImp();
    const { selectedGroup, setSelectedGroup, clearSelectedGroup } = useGroupStore();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [groups, setGroups] = useState<GroupInformation[]>([]);
    const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
    const [joinSolicitations, setJoinSolicitations] = useState<JoinSolicitationResponse[]>([]);
    const [initialized, setInitialized] = useState<boolean>(false);

    // Initialize: Load groups and set default group
    useEffect(() => {
        if (!initialized) {
            loadInitialData();
        }
    }, [initialized]);

    // Validate and set default group when groups change
    useEffect(() => {
        if (initialized && groups.length > 0) {
            validateAndSetDefaultGroup();
        } else if (initialized && groups.length === 0) {
            // User has no groups, clear selected group
            clearSelectedGroup();
        }
    }, [groups, initialized]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadGroups(),
                loadInvitations(),
                loadJoinSolicitations()
            ]);
            setInitialized(true);
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al cargar los datos iniciales');
            setLoading(false);
            setInitialized(true);
        }
    };

    const validateAndSetDefaultGroup = () => {
        // Check if cached selected group still exists
        if (selectedGroup) {
            const groupExists = groups.find(g => g.id === selectedGroup.id);
            if (!groupExists) {
                // Cached group was deleted or user was kicked
                // Set first available group as default
                const firstGroup = groups[0];
                if (firstGroup) {
                    setSelectedGroup({
                        id: firstGroup.id,
                        name: firstGroup.name,
                        memberCount: firstGroup.members
                    });
                }
            }
        } else {
            // No cached group, select the first one
            const firstGroup = groups[0];
            if (firstGroup) {
                setSelectedGroup({
                    id: firstGroup.id,
                    name: firstGroup.name,
                    memberCount: firstGroup.members
                });
            }
        }
    };

    const loadGroups = async () => {
        try {
            const response = await groupService.getUserGroups();
            setGroups(response);
        } catch (error: any) {
            throw error;
        }
    };

    const loadInvitations = async () => {
        try {
            const response = await groupService.getInvitationByUser();
            setInvitations(response);
        } catch (error: any) {
            throw error;
        }
    };

    const loadJoinSolicitations = async () => {
        try {
            const response = await groupService.getJoinSolicitationByUser();
            setJoinSolicitations(response);
        } catch (error: any) {
            throw error;
        }
    };

    const refreshGroups = async () => {
        try {
            setLoading(true);
            await loadGroups();
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al cargar los grupos');
            setLoading(false);
        }
    };

    const refreshInvitations = async () => {
        try {
            setLoading(true);
            await loadInvitations();
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al cargar las invitaciones');
            setLoading(false);
        }
    };

    const refreshJoinSolicitations = async () => {
        try {
            setLoading(true);
            await loadJoinSolicitations();
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al cargar las solicitudes de unión');
            setLoading(false);
        }
    };

    const createGroup = async (name: string) => {
        try {
            setLoading(true);
            const validatedName = validateCreateGroup(name);

            const createdGroup = await groupService.createGroup(validatedName);

            try {
                await groupService.createDefaultCategories(createdGroup.id);
            } catch (categoryError: any) {
                console.error('Error creating default categories:', categoryError);
            }

            await loadGroups();
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al crear el grupo');
            setLoading(false);
        }
    };

    const renameGroup = async (groupId: string, name: string) => {
        try {
            setLoading(true);
            const validatedGroupId = validateGroupId(groupId);
            const validatedName = validateCreateGroup(name);

            await groupService.renameGroup({
                idGroup: validatedGroupId,
                name: validatedName
            });

            // Update selected group name if it's the one being renamed
            if (selectedGroup?.id === validatedGroupId) {
                setSelectedGroup({
                    ...selectedGroup,
                    name: validatedName
                });
            }

            // Reload groups to reflect the change
            await loadGroups();
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al renombrar el grupo');
            setLoading(false);
            throw error; // Re-throw to allow caller to handle
        }
    };

    const leaveGroup = async (groupId: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedGroupId = validateGroupId(groupId);
            await groupService.leaveGroup(validatedGroupId);

            // If leaving the selected group, clear it
            if (selectedGroup?.id === validatedGroupId) {
                clearSelectedGroup();
            }

            // Reload groups after leaving
            await loadGroups();
            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al salir del grupo');
            setLoading(false);
        }
    };

    const joinGroupByCode = async (code: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedCode = validateJoinGroupByCode(code);
            await groupService.createJoinSolicitation(validatedCode);
            // Note: This creates a join solicitation, not immediately joining
            // Groups will be reloaded when the solicitation is accepted by group admin
            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al enviar la solicitud de unión');
            setLoading(false);
        }
    };

    const acceptInvitation = async (invitationId: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedInvitationId = validateInvitationId(invitationId);
            await groupService.acceptInvitation(validatedInvitationId);

            // Reload both groups and invitations after accepting
            await Promise.all([
                loadGroups(),
                loadInvitations()
            ]);

            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al aceptar la invitación');
            setLoading(false);
        }
    };

    const declineInvitation = async (invitationId: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedInvitationId = validateInvitationId(invitationId);
            await groupService.declineInvitation(validatedInvitationId);

            // Reload invitations after declining
            await loadInvitations();

            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al rechazar la invitación');
            setLoading(false);
        }
    };

    const cancelInvitation = async (invitationId: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedInvitationId = validateInvitationId(invitationId);
            await groupService.cancelInvitation(validatedInvitationId);

            // Reload invitations after canceling
            await loadInvitations();

            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al cancelar la invitación');
            setLoading(false);
        }
    };

    const cancelJoinSolicitation = async (solicitationId: string) => {
        try {
            setLoading(true);
            await groupService.cancelJoinSolicitation(solicitationId);

            // Reload join solicitations after canceling
            await loadJoinSolicitations();

            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al cancelar la solicitud de unión');
            setLoading(false);
        }
    };

    const createRol = async (data: RolInfoCreate) => {
        try {
            setLoading(true);
            await groupService.createRol(data);
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al crear el rol');
            setLoading(false);
            throw error; // Re-throw to allow caller to handle
        }
    };

    const reassignRol = async (data: ReasingRol) => {
        try {
            setLoading(true);
            await groupService.reasingRol(data);
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al reasignar el rol');
            setLoading(false);
            throw error; // Re-throw to allow caller to handle
        }
    };

    const deleteRol = async (groupId: string, rolId: string) => {
        try {
            setLoading(true);
            await groupService.deleteRol({ groupId, rolId });
            setLoading(false);
        } catch (error: any) {
            setError(error?.message || 'Error al eliminar el rol');
            setLoading(false);
            throw error; // Re-throw to allow caller to handle
        }
    };

    const clearError = (): void => {
        setError(undefined);
    };

    return {
        isLoading,
        error,
        groups,
        invitations,
        joinSolicitations,
        selectedGroup,
        createGroup,
        renameGroup,
        leaveGroup,
        joinGroupByCode,
        acceptInvitation,
        declineInvitation,
        cancelInvitation,
        cancelJoinSolicitation,
        createRol,
        reassignRol,
        deleteRol,
        refreshGroups,
        refreshInvitations,
        refreshJoinSolicitations,
        clearError
    };
};
