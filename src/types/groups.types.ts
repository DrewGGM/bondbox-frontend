export interface DeleteRolPetition {
  groupId: string;
  rolId: string;
}

// ------------- Groups -------------
export interface GroupInformation {
  id: string;
  unionCode: string;
  name: string;
  createdAt: Date;
  members: number;
}

export interface UsersGroupInformation {
  id: string;
  full_name: string;
  email: string;
}

export interface RenameGroup{
  idGroup : string
  name : string
}
//--roles--

export interface PermsConfig {
  invitePeople: boolean;
  kickPeople: boolean;
  createTask: boolean;
  deleteTask: boolean;
  updateTask: boolean;
  createInventory: boolean;
  deleteInventory: boolean;
  updateInventory: boolean;
  createFinances: boolean;
  deleteFinances: boolean;
  updateFinances: boolean;
  createRol: boolean;
  editable: boolean;
  updateRol: boolean;
}

export interface RolInfo{
    id: string,
    rolName: string,
    permsCongig : PermsConfig
}

export interface RolInfoCreate{
    idGroup: string,
    rolName: string,
    permsCongig : PermsConfig
}

export interface ReasingRol{
  to : string,
  rolId : string,
  groupId : string
}

export interface BasicInfoRol{
  id: string,
  rolName: string,
}

//-----Join Invitation--------

export interface AcceptJoinSolicitation {
  id: string;
  rolId: string;
}

export interface DeclineJoinSolicitation {
  id: string;
}

export interface JoinSolicitationResponse {
  id: string;
  idUser: string;
  status: number;
  group: GroupInformation
}


//---------Invitation------------

export interface CreateInvitation {
  expiresIn: Date,
  toUser: string,
  idGroup: string,
  initialRol: string
}

export interface InvitationResponse{
  id: string,
  createdAt: Date,
  expiresIn: Date,
  status: number,
  fromUser: string,
  toUser: string,
  group: GroupInformation,
  rol:BasicInfoRol
}