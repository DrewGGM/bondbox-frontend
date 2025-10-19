import { UserService , UserServiceImp } from "@/api/services/userService";
import { CodeVerification, LoginForm, RegisterUserForm, UserInfo } from "@/types/users.types";
import { useState } from "react";
import { validateLogin, validateRegister, validateOtpVerification } from "@/schemas";

export interface UseUserActions {

    isLoading : boolean;

    error : string | undefined

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

    const [error,setError] = useState<string | undefined>(undefined)

    const [userInfo,setUserInfo] = useState<UserInfo>()

    const login = async (data : LoginForm) => {
        try {
            setLoading(true)
            // Validate data before sending to service
            const validatedData = validateLogin(data)
            await userService.login(validatedData)
            setLoading(false)
        } catch (error:any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Ocurrió un error inesperado')
            setLoading(false)
        }
    }

    const register = async (data : RegisterUserForm) => {
        try {
            setLoading(true)
            // Validate data before sending to service
            const validatedData = validateRegister(data)
            await userService.register(validatedData)
            setLoading(false)
        } catch (error:any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Ocurrió un error inesperado')
            setLoading(false)
        }
    }

    const otpVerification = async (data : CodeVerification) => {
        try {
            setLoading(true)
            // Validate data before sending to service
            const validatedData = validateOtpVerification(data)
            await userService.verifyOtp(validatedData)
            setLoading(false)
        } catch (error:any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Ocurrió un error inesperado')
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
            // ApiError already contains user-friendly message
            setError(error?.message || 'Ocurrió un error inesperado')
            setLoading(false)
        }
    }

    const clearError = () : void => {
        setError(undefined)
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