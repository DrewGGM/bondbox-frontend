import { LoginForm, RegisterUserForm, CodeVerification, UpdatePasswordDto } from '@/types/users.types';
import { loginSchema, registerSchema, otpVerificationSchema, updatePasswordSchema } from './userSchemas';
import { validate } from './validator';

/**
 * Validate login data
 * @param data - Login form data
 * @returns Validated login data
 * @throws ValidationError if validation fails
 */
export const validateLogin = (data: unknown): LoginForm => {
  return validate(loginSchema, data) as LoginForm;
};

/**
 * Validate register data
 * @param data - Register form data
 * @returns Validated register data
 * @throws ValidationError if validation fails
 */
export const validateRegister = (data: unknown): RegisterUserForm => {
  return validate(registerSchema, data) as RegisterUserForm;
};

/**
 * Validate OTP verification data
 * @param data - OTP verification data
 * @returns Validated OTP data
 * @throws ValidationError if validation fails
 */
export const validateOtpVerification = (data: unknown): CodeVerification => {
  return validate(otpVerificationSchema, data) as CodeVerification;
};

/**
 * Validate update password data
 * @param data - Update password data
 * @returns Validated update password data
 * @throws ValidationError if validation fails
 */
export const validateUpdatePassword = (data: unknown): UpdatePasswordDto => {
  return validate(updatePasswordSchema, data) as UpdatePasswordDto;
};
