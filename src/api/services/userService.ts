import type { RegisterUserForm ,LoginForm, CodeVerification,UserInfo, OtpResponse, UpdatePasswordDto } from "@/types/users.types";
import { userHttpInstance, authenticatedHttpInstance } from "@/utils/httpInstance";
import apiErrorHandler from "@/utils/apiErrorHandler";
import credentialManager from "@/utils/credentialManager";

export interface UserService{
    login (data : LoginForm): Promise<void>
    register (data : RegisterUserForm) : Promise<void>
    verifyOtp (data : CodeVerification) : Promise<OtpResponse>
    userInfo () : Promise<UserInfo>
    verifyToken () : Promise<void>
    changePassword (data : UpdatePasswordDto) : Promise<void>
}

export class UserServiceImp implements UserService{
    async login(data: LoginForm): Promise<void> {
        try {
            await userHttpInstance.post("/users/login",data)
        } catch (error : any) {
            throw apiErrorHandler(error);
        }
    }
    async register(data: RegisterUserForm): Promise<void> {
        try {
            await userHttpInstance.post("/users/register",data)
        } catch (error : any) {
            throw apiErrorHandler(error);
        }
    }

    async verifyOtp(data: CodeVerification): Promise<OtpResponse> {
        try {
            const response = await userHttpInstance.post<OtpResponse>("/users/verify-otp", data);
            credentialManager.putToken(response.data.token)
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }

    async userInfo(): Promise<UserInfo> {
        try {
            // Uses authenticatedHttpInstance which automatically adds auth header
            const response = await authenticatedHttpInstance.get<UserInfo>("/users/userInfo");
            return response.data;
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }

    async verifyToken () : Promise<void>{
        try {
            // Uses authenticatedHttpInstance which automatically adds auth header
            await authenticatedHttpInstance.get<UserInfo>("/users/verify");
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }

    async changePassword(data: UpdatePasswordDto): Promise<void> {
        try {
            await authenticatedHttpInstance.put("/users/change-password", data);
        } catch (error: any) {
            throw apiErrorHandler(error);
        }
    }

}