import { handleApiError, getErrorMessage, isKnownError } from './errorHandler';

/**
 * Structured API Error
 */
export class ApiError extends Error {
  code?: string;
  status?: number;
  field?: string;
  reason?: string;

  constructor(message: string, code?: string, status?: number, field?: string, reason?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.field = field;
    this.reason = reason;

  }
}

/**
 * API Error Handler - processes API errors and returns structured ApiError
 * @param error - Axios error object or any error
 * @returns Throws ApiError with structured information
 */
const apiErrorHandler = (error: any): never => {
  // Handle timeout errors specifically
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    throw new ApiError(
      'La solicitud está tardando demasiado. Por favor intenta nuevamente.',
      '99-03-05',
      408
    );
  }

  // Handle network errors
  if (error.message?.includes('Network Error')) {
    throw new ApiError(
      'Error de conexión. Por favor verifica tu conexión a internet.',
      'NETWORK_ERROR',
      0
    );
  }

  // Handle Axios response errors
  if (error?.response) {
    const { data, status } = error.response;

    // Extract error code from backend response
    const errorCode = data?.code;
    const field = data?.field;
    const reason = data?.reason;

    if (errorCode) {
      // Check if we have a known error code
      if (isKnownError(errorCode)) {
        let message = getErrorMessage(errorCode);

        // Replace placeholders for validation errors (99-01-03)
        if (message.includes('{field}') || message.includes('{reason}')) {
          message = message
            .replace('{field}', field || 'campo')
            .replace('{reason}', reason || 'valor inválido');
        }

        throw new ApiError(message, errorCode, status, field, reason);
      } else {
        // Unknown error code, return code itself
        throw new ApiError(
          `Error del servidor: ${errorCode}`,
          errorCode,
          status
        );
      }
    }

    // No error code but has custom message from backend
    if (data?.message) {
      throw new ApiError(data.message, undefined, status);
    }

    // Use handleApiError as fallback for generic HTTP errors
    const message = handleApiError(error);
    throw new ApiError(message, undefined, status);
  }

  // Handle request errors (no response received)
  if (error?.request) {
    throw new ApiError(
      'No se recibió respuesta del servidor. Por favor verifica tu conexión.',
      'NO_RESPONSE',
      0
    );
  }

  // Generic fallback for unknown errors
  throw new ApiError(
    error?.message || 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
    'UNKNOWN_ERROR',
    500
  );
};

export default apiErrorHandler;
