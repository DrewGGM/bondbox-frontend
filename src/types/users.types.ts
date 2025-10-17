export interface RegisterUserForm {
    email: string,
    password:string,
    full_name:string,
    image_profile_url: URL,
    nit: string,
    phone_number: string,
    birthday: Date
}

export interface LoginForm {
    email: string,
    password:string,
}

export interface CodeVerification {
    code : string,
    email : string
}

export interface UserInfo {
    email: string,
    full_name:string,
    image_profile_url: URL,
    nit: string,
    phone_number: string,
    birthday: Date
}

export interface OtpResponse{
    token: string,
    message : string
}

