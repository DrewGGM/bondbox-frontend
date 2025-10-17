import type { RegisterUserForm ,LoginForm, CodeVerification,UserInfo, OtpResponse } from "@/types/users.types";
import httpInstance from "@/utils/httpInstance";
import handler from "@/utils/errorHttpHandler";
import credentialManager from "@/utils/credentialManager";

export interface UserService{
    login (data : LoginForm):void
    register (data : RegisterUserForm) : void
    verifyOtp (data : CodeVerification) : Promise<OtpResponse>
    userInfo () : Promise<UserInfo>
}

export class UserServiceImp implements UserService{
    async login(data: LoginForm): Promise<void> {
        try {
            await httpInstance.post("/users/login",data)
        } catch (error : any) {
            handler(error);
        }
    }
    async register(data: RegisterUserForm): Promise<void> {
        try {
            await httpInstance.post("/users/register",data)
        } catch (error : any) {
            handler(error);
        }
    }

    async verifyOtp(data: CodeVerification): Promise<OtpResponse> {
        try {
            const response = await httpInstance.post<OtpResponse>("/users/verify-otp", data);
            credentialManager.putToken(response.data.token)
            return response.data;
        } catch (error: any) {
            throw handler(error);
        }
    }

    async userInfo(): Promise<UserInfo> {
        try {
            const response = await httpInstance.post<UserInfo>("/users/verify-otp",null,{
                headers : {
                    "Authorization" : `Bearer ${credentialManager.token}`
                }
            });
            return response.data;
        } catch (error: any) {
            throw handler(error);
        }
    }

}