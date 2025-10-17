import { ERROR_CODES, DEFAULT_ERROR_MESSAGES, FALLBACK_ERROR_MESSAGE } from './errorCodes';

/**
 * API Error Response structure
 */
export interface ApiError {
  code?: string;
  message?: string;
  status?: number;
  field?: string;
  reason?: string;
}

/**
 * Get error message based on error code
 * @param errorCode - The error code from backend (e.g., '01-01-01')
 * @returns User-friendly error message
 */
export const getErrorMessage = (errorCode: string): string => {
  const errorDef = ERROR_CODES[errorCode];
  if (errorDef) {
    return errorDef.message;
  }
  return FALLBACK_ERROR_MESSAGE;
};

/**
 * Get error message based on HTTP status code
 * @param status - HTTP status code
 * @returns User-friendly error message
 */
export const getErrorMessageByStatus = (status: number): string => {
  return DEFAULT_ERROR_MESSAGES[status] || FALLBACK_ERROR_MESSAGE;
};

/**
 * Main error handler - processes API errors and returns user-friendly messages
 * @param error - Axios error object or any error
 * @returns User-friendly error message string
 */
export const handleApiError = (error: any): string => {
  // Handle Axios errors
  if (error?.response) {
    const { data, status } = error.response;

    // Priority 1: Check if backend sent an error code
    if (data?.code) {
      const message = getErrorMessage(data.code);

      // Replace placeholders if present (e.g., {field}, {reason})
      if (message.includes('{field}') || message.includes('{reason}')) {
        return message
          .replace('{field}', data.field || 'campo')
          .replace('{reason}', data.reason || 'valor inválido');
      }

      return message;
    }

    // Priority 2: Check if backend sent a custom message
    if (data?.message) {
      return data.message;
    }

    // Priority 3: Use HTTP status code
    if (status) {
      return getErrorMessageByStatus(status);
    }
  }

  // Handle network errors
  if (error?.message) {
    if (error.message.includes('Network Error')) {
      return 'Error de conexión. Por favor verifica tu conexión a internet.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'La solicitud está tardando demasiado. Por favor intenta nuevamente.';
    }
    if (error.message.includes('timeout')) {
      return 'Tiempo de espera agotado. Por favor intenta nuevamente.';
    }
  }

  // Fallback
  return FALLBACK_ERROR_MESSAGE;
};

/**
 * Check if error code exists in our error definitions
 * @param errorCode - The error code to check
 * @returns boolean
 */
export const isKnownError = (errorCode: string): boolean => {
  return errorCode in ERROR_CODES;
};

/**
 * Get complete error definition by code
 * @param errorCode - The error code
 * @returns Error definition object or null
 */
export const getErrorDefinition = (errorCode: string) => {
  return ERROR_CODES[errorCode] || null;
};

/**
 * Format validation error (for form validation errors)
 * @param field - Field name that failed validation
 * @param reason - Reason for validation failure
 * @returns Formatted error message
 */
export const formatValidationError = (field: string, reason: string): string => {
  return `El campo ${field} no es válido: ${reason}`;
};

export default handleApiError;
