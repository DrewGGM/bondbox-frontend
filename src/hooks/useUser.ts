import { UserService , UserServiceImp } from "@/api/services/userService";
import { CodeVerification, LoginForm, RegisterUserForm, UserInfo, UpdatePasswordDto } from "@/types/users.types";
import { useState } from "react";
import { validateLogin, validateRegister, validateOtpVerification, validateUpdatePassword } from "@/schemas";
import { useAuthStore } from "@/store/authStore";

export interface UseUserActions {

    isLoading : boolean;

    error : string | undefined

    userInfo : UserInfo | undefined

    login (data : LoginForm) : void

    register (data : RegisterUserForm) : void

    otpVerification (data : CodeVerification) : void

    refreshUserInfo () : void

    changePassword (data : UpdatePasswordDto) : void

    logout () : void

    clearError () : void
}

export const useUser = () : UseUserActions => {

    const userService : UserService = new UserServiceImp ()
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
    const logoutAuth = useAuthStore((state) => state.logout)

    const [isLoading,setLoading] = useState<boolean>(false)

    const [error,setError] = useState<string | undefined>(undefined)

    const [userInfo,setUserInfo] = useState<UserInfo>()

    const login = async (data : LoginForm) => {
        try {
            setLoading(true)
            // Validate data before sending to service
            const validatedData = validateLogin(data)
            await userService.login(validatedData)
            // Don't set authenticated here - only after OTP verification
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
            // Update auth store on successful OTP verification
            setAuthenticated(true);
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

    const changePassword = async (data : UpdatePasswordDto) => {
        try {
            setLoading(true)
            // Validate data before sending to service
            const validatedData = validateUpdatePassword(data)
            await userService.changePassword(validatedData)
            setLoading(false)
        } catch (error:any) {
            // Handle both ValidationError and ApiError
            setError(error?.message || 'Ocurrió un error al cambiar la contraseña')
            setLoading(false)
            throw error; // Re-throw to allow caller to handle
        }
    }

    const logout = () : void => {
        // Call auth store logout (clears token and updates state)
        logoutAuth();
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
        changePassword,
        logout,
        clearError
    }

}