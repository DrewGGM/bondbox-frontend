import { z } from 'zod';

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

/**
 * Register Form Schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
  full_name: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  nit: z
    .string()
    .min(8, 'El NIT es requerido')
    .max(10, 'El NIT es muy largo')
    .regex(/^\d{1,10}-?\d?$/, 'Formato de NIT inválido (ej: 123456789-0)'),
  phone_number: z
    .string()
    .min(1, 'El número de teléfono es requerido')
    .regex(/^[0-9]{10}$/, 'Formato de teléfono inválido (ej:300 000 0000)'),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido. Debe ser YYYY-MM-DD (ej: 1995-05-20)')
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, {
      message: 'La fecha proporcionada no es válida',
    })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date < new Date();
    }, {
      message: 'La fecha de nacimiento debe ser en el pasado',
    })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 12 && age <= 120;
    }, {
      message: 'Debes tener entre 12 y 120 años',
    }),
  image_profile_url: z
    .union([
      z.instanceof(URL),
      z.string().url('URL de perfil inválida').transform((str) => new URL(str)),
      z.null()
    ])
    .nullable(),
});

/**
 * OTP Verification Schema
 */
export const otpVerificationSchema = z.object({
  code: z
    .string()
    .min(1, 'El código de verificación es requerido')
    .regex(/^\d{6}$/, 'El código debe tener 6 dígitos'),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico inválido'),
});

// Export types inferred from schemas
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type OtpVerificationSchemaType = z.infer<typeof otpVerificationSchema>;
