import { UserService , UserServiceImp } from "@/api/services/userService";
import { CodeVerification, LoginForm, RegisterUserForm, UserInfo } from "@/types/users.types";
import { useState,useEffect } from "react";
import { getErrorMessage } from "@/utils/errorHandler";

export interface UseUserActions {
    
    isLoading : boolean;

    error : string | null

    userInfo : UserInfo | undefined

    login (data : LoginForm) : void

    register (data : RegisterUserForm) : void

    otpVerification (data : CodeVerification) : void

    refreshUserInfo () : void

    clearError () : void
}

export const useUser = () : UseUserActions => {

    const userService : UserService = new UserServiceImp ()

    const [isLoading,setLoading] = useState<boolean>(false)

    const [error,setError] = useState<string | null>(null)

    const [userInfo,setUserInfo] = useState<UserInfo>()

    const login = async (data : LoginForm) => {
        try {
            setLoading(true)
            await userService.login(data)
            setLoading(false)
        } catch (error:any) {
            // error.message contains the error code (e.g., "99-02-01")
            setError(getErrorMessage(error.message))
            setLoading(false)
        }
    }

    const register = async (data : RegisterUserForm) => {
        try {
            setLoading(true)
            await userService.register(data)
            setLoading(false)
        } catch (error:any) {
            // error.message contains the error code (e.g., "01-01-02")
            setError(getErrorMessage(error.message))
            setLoading(false)
        }
    }

    const otpVerification = async (data : CodeVerification) => {
        try {
            setLoading(true)
            await userService.verifyOtp(data)
            setLoading(false)
        } catch (error:any) {
            // error.message contains the error code (e.g., "01-01-05")
            setError(getErrorMessage(error.message))
            setLoading(false)
        }
    }

    const refreshUserInfo = async () => {
        try {
            setLoading(true)
            const response = await userService.userInfo()
            setUserInfo(response)
            setLoading(false)
        } catch (error:any) {
            // error.message contains the error code
            setError(getErrorMessage(error.message))
            setLoading(false)
        }
    }

    const clearError = () : void => {
        setError(null)
    }

    return{
        isLoading,
        error,
        userInfo,
        login,
        register,
        otpVerification,
        refreshUserInfo,
        clearError
    }

}