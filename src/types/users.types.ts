export interface RegisterUserForm {
    email: string,
    password:string,
    full_name:string,
    image_profile_url: URL | null,
    nit: string,
    phone_number: string,
    birthday: string  // Format: YYYY-MM-DD (e.g., "1995-05-20")
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
    image_profile_url: URL | null,
    nit: string,
    phone_number: string,
    birthday: string  // Format: YYYY-MM-DD (e.g., "1995-05-20")
}

export interface OtpResponse{
    token: string,
    message : string
}

export interface UpdatePasswordDto {
    new_password: string;
    old_password: string;
}
