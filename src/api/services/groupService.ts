import type {AcceptJoinSolicitation,CreateInvitation,DeclineJoinSolicitation,DeleteRolPetition,GroupInformation,JoinSolicitationResponse,ReasingRol,RolInfo,RolInfoCreate,UsersGroupInformation,RenameGroup, InvitationResponse} from "@/types/groups.types";
import { authenticatedHttpInstance } from "@/utils/httpInstance";
import apiErrorHandler from "@/utils/apiErrorHandler";

export interface CreateGroupResponse {
    id: string;
    name: string;
}

export interface GroupService {
    createGroup(name:string) : Promise<CreateGroupResponse>
    createDefaultCategories(groupId: string) : Promise<void>
    leaveGroup(idGroup:string) : Promise<void>
    getUserGroups() : Promise<GroupInformation[]>
    getUsersGroup(idGroup:string) : Promise<UsersGroupInformation[]>
    renameGroup(data : RenameGroup) : Promise<void>

    createRol(data : RolInfoCreate) : Promise<void>
    getRolesByGroup(idGroup : string) : Promise<RolInfo[]>
    reasingRol(data : ReasingRol) : Promise<void>
    deleteRol(data : DeleteRolPetition) : Promise<void>

    createJoinSolicitation(code : string) : Promise<void>
    cancelJoinSolicitation(id : string) : Promise<void>
    declineJoinSolicitation(data : DeclineJoinSolicitation) : Promise<void>
    acceptJoinSolicitation(data : AcceptJoinSolicitation) : Promise<void>
    getJoinSolicitationByUser() : Promise<JoinSolicitationResponse[]>
    getJoinSolicitationByGroup(groupId : string) : Promise<JoinSolicitationResponse[]>

    createInvitation(data : CreateInvitation) : Promise<void>
    acceptInvitation(idInvitation : string) : Promise<void>
    declineInvitation(id : string) : Promise<void>
    cancelInvitation(idInvitation : string) : Promise<void>
    getInvitationByUser () : Promise<InvitationResponse[]>
    getInvitationByGroupId (groupId : string) : Promise<InvitationResponse[]>
}

export class GroupsServiceImp implements GroupService{
    async declineJoinSolicitation(data: DeclineJoinSolicitation): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/joinSolicitations/decline/${data.id}`);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async createGroup(name: string): Promise<CreateGroupResponse> {
        try {
            const response = await authenticatedHttpInstance.post<CreateGroupResponse>("/groups/createGroup",{
                "name" : name
            });
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }

    async createDefaultCategories(groupId: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/${groupId}/categories/default`);
        } catch (error: any) {
            console.error('Error creating default categories:', error);
            throw apiErrorHandler(error);
        }
    }
    async leaveGroup(idGroup: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/${idGroup}/leave`);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getUserGroups(): Promise<GroupInformation[]> {
        try {
            const response = await authenticatedHttpInstance.get<GroupInformation[]>("/groups");
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getUsersGroup(idGroup:string): Promise<UsersGroupInformation[]> {
        try {
            const response = await authenticatedHttpInstance.get<UsersGroupInformation[]>(`/groups/${idGroup}/users`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async renameGroup(data: RenameGroup): Promise<void> {
        try {
            await authenticatedHttpInstance.put("/groups/rename",data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async createRol(data: RolInfoCreate): Promise<void> {
        try {
            await authenticatedHttpInstance.post("/groups/roles",data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getRolesByGroup(idGroup: string): Promise<RolInfo[]> {
        try {
            const response = await authenticatedHttpInstance.get<RolInfo[]>(`/groups/${idGroup}/roles`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async reasingRol(data: ReasingRol): Promise<void> {
        try {
            await authenticatedHttpInstance.put(`/groups/roles/reassign`,data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async deleteRol(data: DeleteRolPetition): Promise<void> {
        try {
            await authenticatedHttpInstance.delete(`/groups/roles`, { data });
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async createJoinSolicitation(code: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/joinSolicitations/unionByCode/${code}`);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async cancelJoinSolicitation(id: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/join-solicitations/cancel/${id}`);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async acceptJoinSolicitation(data: AcceptJoinSolicitation): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/join-solicitations/accept`,data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getJoinSolicitationByUser(): Promise<JoinSolicitationResponse[]> {
        try {
            const response = await authenticatedHttpInstance.get<JoinSolicitationResponse[]>(`/groups/join-solicitations/user`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getJoinSolicitationByGroup(groupId: string): Promise<JoinSolicitationResponse[]> {
        try {
            const response = await authenticatedHttpInstance.get<JoinSolicitationResponse[]>(`/groups/join-solicitations/group/${groupId}`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async createInvitation(data: CreateInvitation): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/invitations`,data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async acceptInvitation(idInvitation: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/invitations/accept`,{
                id : idInvitation
            });
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async declineInvitation(id : string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/invitations/decline`,{
                id
            });
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async cancelInvitation(idInvitation: string): Promise<void> {
        try {
            await authenticatedHttpInstance.post(`/groups/invitations/cancel/${idInvitation}`);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getInvitationByUser(): Promise<InvitationResponse[]> {
        try {
            const response = await authenticatedHttpInstance.get<InvitationResponse[]>(`/groups/users/invitations`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
    async getInvitationByGroupId(groupId: string): Promise<InvitationResponse[]> {
        try {
            const response = await authenticatedHttpInstance.get<InvitationResponse[]>(`/groups/join-solicitations/group/${groupId}`);
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }
}