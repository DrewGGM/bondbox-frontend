import { GroupService, GroupsServiceImp } from "@/api/services/groupService";
import { useGroupStore } from "@/store/groupStore";
import { GroupInformation, InvitationResponse } from "@/types/groups.types";
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
    selectedGroup: { id: string; name: string; memberCount?: number } | null;

    createGroup(name: string): void;
    leaveGroup(groupId: string): void;
    joinGroupByCode(code: string): void;
    acceptInvitation(invitationId: string): void;
    declineInvitation(invitationId: string): void;
    cancelInvitation(invitationId: string): void;
    refreshGroups(): void;
    refreshInvitations(): void;
    clearError(): void;
}

export const useGroups = (): UseGroupsActions => {
    const groupService: GroupService = new GroupsServiceImp();
    const { selectedGroup, setSelectedGroup, clearSelectedGroup } = useGroupStore();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [groups, setGroups] = useState<GroupInformation[]>([]);
    const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
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
                loadInvitations()
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

    const createGroup = async (name: string) => {
        try {
            setLoading(true);
            // Validate data before sending to service
            const validatedName = validateCreateGroup(name);
            await groupService.createGroup(validatedName);
            // Reload groups after successful creation
            await loadGroups();
            setLoading(false);
        } catch (error: any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Error al crear el grupo');
            setLoading(false);
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

    const clearError = (): void => {
        setError(undefined);
    };

    return {
        isLoading,
        error,
        groups,
        invitations,
        selectedGroup,
        createGroup,
        leaveGroup,
        joinGroupByCode,
        acceptInvitation,
        declineInvitation,
        cancelInvitation,
        refreshGroups,
        refreshInvitations,
        clearError
    };
};
