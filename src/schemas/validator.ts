import { z, ZodError } from 'zod';

/**
 * Custom Validation Error
 */
export class ValidationError extends Error {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Format Zod errors into user-friendly messages
 */
export const formatZodErrors = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return errors;
};

/**
 * Get first error message from validation errors
 */
export const getFirstError = (errors: Record<string, string>): string => {
  const firstKey = Object.keys(errors)[0];
  return errors[firstKey] || 'Error de validación';
};

/**
 * Generic validator function
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @throws ValidationError if validation fails
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = formatZodErrors(error);
      const firstErrorMessage = getFirstError(formattedErrors);
      throw new ValidationError(firstErrorMessage, formattedErrors);
    }
    throw error;
  }
};

/**
 * Safe validation that returns result object instead of throwing
 */
export const validateSafe = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string>; message: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = formatZodErrors(error);
      const firstErrorMessage = getFirstError(formattedErrors);
      return { success: false, errors: formattedErrors, message: firstErrorMessage };
    }
    return { success: false, errors: {}, message: 'Error de validación desconocido' };
  }
};
