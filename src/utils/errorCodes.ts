/**
 * Error codes and messages constants
 * Format: [code]: { status: number, message: string, description: string }
 */

export interface ErrorDefinition {
  status: number;
  message: string;
  description: string;
}

export const ERROR_CODES: Record<string, ErrorDefinition> = {
  // ============================================================================
  // 01-XX-XX: Authentication & Registration Errors
  // ============================================================================
  '01-01-01': {
    status: 400,
    description: 'La fecha de nacimiento esta en futuro',
    message: 'Error: La fecha de nacimiento es inválida',
  },
  '01-01-02': {
    status: 409,
    description: 'Usuario ya registrado',
    message: 'Ya estás registrado, por favor redirigete al login',
  },
  '01-01-03': {
    status: 409,
    description: 'NIT en uso',
    message: 'Ya estas registrado con este NIT, por favor redirigete al login',
  },
  '01-01-04': {
    status: 404,
    description: 'User con email no encontrado',
    message:
      'Este email no esta registrado en nuestro sistema, por favor contactarte con el equipo de soporte si crees que es un error',
  },
  '01-01-05': {
    status: 401,
    description: 'OTP invalido',
    message:
      'Este OTP parece incorrecto, no te preocupes aun puedes intentar escribiendolo correctamente',
  },
  '01-01-06': {
    status: 401,
    description: 'OTP caducado o inexistente',
    message:
      'Parece que ya has llegado al limite de intentos validos por OTP enviado, intenta generar uno nuevo',
  },
  '01-02-01': {
    status: 404,
    description: 'No se pudo encontrar el usuario autenticado',
    message: 'Error: No pudimos recuperar tu identidad, por favor contactar a soporte',
  },

  // ============================================================================
  // 02-XX-XX: Group & User Management Errors
  // ============================================================================
  '02-01-01': {
    status: 404,
    description: 'No se encontro el usuario en el grupo asignado',
    message: 'USER_IP_NOT_FOUND',
  },
  '02-01-02': {
    status: 404,
    description: 'No se encontro el grupo',
    message: 'GROUP_NOT_FOUND',
  },
  '02-01-03': {
    status: 404,
    description: 'Grupo no encontrado con el Unique union code',
    message: 'GROUP_NOT_FOUND_BY_CODE',
  },
  '02-02-01': {
    status: 403,
    description: 'El usuario no tiene permisos para esta accion en el grupo',
    message: 'USER_WITH_NO_PERMISSIONS',
  },
  '02-02-02': {
    status: 403,
    description: 'No puedes asignar rol de Admin',
    message: 'ROL_ADMIN_NOT_ASSIGNABLE',
  },
  '02-02-03': {
    status: 404,
    description: 'El usuario al que se quiere resignar el rol no esta en el grupo',
    message: 'USER_NOT_ELEGIBLE_TO_REASSIGN',
  },
  '02-02-04': {
    status: 404,
    description: 'Rol no fue encontrado',
    message: 'ROL_NOT_FOUND',
  },
  '02-02-05': {
    status: 409,
    description: 'Rol en uso',
    message: 'ROL_IN_USE',
  },
  '02-02-06': {
    status: 403,
    description: 'Se intento eliminar el rol Admin',
    message: 'ROL_ADMIN_NOT_REMOVABLE',
  },
  '02-03-01': {
    status: 400,
    description: 'El usuario ya esta en ese grupo',
    message: 'USER_ALREADY_IN_THE_GROUP',
  },
  '02-03-02': {
    status: 400,
    description: 'El rol inicial de la invitacion no es valido o no le pertenece al grupo',
    message: 'INVALID_INITIAL_ROL',
  },
  '02-03-03': {
    status: 400,
    description: 'El usuario ya esta invitado',
    message: 'USER_ALREADY_INVITED',
  },
  '02-03-04': {
    status: 400,
    description: 'La invitacion no le pertenece al usuario',
    message: 'INVITATION_NOT_BELONGS_TO_USER',
  },
  '02-03-05': {
    status: 404,
    description: 'Invitacion No encontrada',
    message: 'INVITATION_NOT_FOUND',
  },
  '02-03-06': {
    status: 400,
    description: 'Invitacion en status invalido',
    message: 'NOT_VALID_INVITATION_STATUS',
  },
  '02-04-01': {
    status: 400,
    description: 'Usuario solicitud de union anteriormente',
    message: 'USER_ALREADY_TRY_TO_JOIN',
  },
  '02-04-02': {
    status: 404,
    description: 'La solicitud de union no existe',
    message: 'JOIN_SOLICITATION_NOT_FOUND',
  },

  // ============================================================================
  // 03-XX-XX: Finance & Transaction Errors
  // ============================================================================

  // Transaction Errors (03-01-XX)
  '03-01-01': {
    status: 404,
    description: 'Transaction not found',
    message: 'Transaction not found',
  },
  '03-01-02': {
    status: 400,
    description: 'Invalid transaction amount',
    message: 'Invalid transaction amount',
  },
  '03-01-03': {
    status: 400,
    description: 'Invalid transaction type',
    message: 'Invalid transaction type',
  },
  '03-01-05': {
    status: 422,
    description: 'Transaction limit exceeded',
    message: 'Transaction limit exceeded',
  },
  '03-01-06': {
    status: 409,
    description: 'Duplicate transaction',
    message: 'Duplicate transaction',
  },
  '03-01-07': {
    status: 500,
    description: 'Failed to update transaction',
    message: 'Failed to update transaction',
  },
  '03-01-08': {
    status: 500,
    description: 'Failed to delete transaction',
    message: 'Failed to delete transaction',
  },
  '03-01-09': {
    status: 422,
    description: 'Insufficient balance',
    message: 'Insufficient balance',
  },

  // Category Errors (03-02-XX)
  '03-02-01': {
    status: 404,
    description: 'Category not found',
    message: 'Category not found',
  },
  '03-02-02': {
    status: 409,
    description: 'Category name already exists',
    message: 'Category name already exists',
  },
  '03-02-03': {
    status: 422,
    description: 'Category is in use',
    message: 'Category is in use',
  },
  '03-02-04': {
    status: 400,
    description: 'Invalid category type',
    message: 'Invalid category type',
  },
  '03-02-08': {
    status: 400,
    description: 'Category type mismatch',
    message: 'Category type mismatch',
  },

  // Budget Errors (03-03-XX)
  '03-03-01': {
    status: 404,
    description: 'Budget not found',
    message: 'Budget not found',
  },
  '03-03-02': {
    status: 422,
    description: 'Budget limit exceeded',
    message: 'Budget limit exceeded',
  },
  '03-03-03': {
    status: 409,
    description: 'Budget already exists for this category',
    message: 'Budget already exists for this category',
  },
  '03-03-04': {
    status: 400,
    description: 'Invalid budget amount',
    message: 'Invalid budget amount',
  },
  '03-03-05': {
    status: 500,
    description: 'Invalid budget period',
    message: 'Invalid budget period',
  },
  '03-03-06': {
    status: 500,
    description: 'Failed to update budget',
    message: 'Failed to update budget',
  },
  '03-03-07': {
    status: 500,
    description: 'Failed to delete budget',
    message: 'Failed to delete budget',
  },
  '03-03-08': {
    status: 400,
    description: 'Invalid alert threshold',
    message: 'Invalid alert threshold',
  },

  // Report Errors (03-04-XX)
  '03-04-02': {
    status: 400,
    description: 'Invalid report period',
    message: 'Invalid report period',
  },

  // Export Errors (03-05-XX)
  '03-05-01': {
    status: 400,
    description: 'Export format not supported',
    message: 'Export format not supported',
  },

  // General Finance Errors (03-06-XX)
  '03-06-01': {
    status: 404,
    description: 'Group not found',
    message: 'Group not found',
  },
  '03-06-02': {
    status: 403,
    description: 'User does not belong to this group',
    message: 'User does not belong to this group',
  },
  '03-06-03': {
    status: 400,
    description: 'Invalid currency',
    message: 'Invalid currency',
  },
  '03-06-05': {
    status: 400,
    description: 'Transaction date cannot be in the future',
    message: 'Transaction date cannot be in the future',
  },
  '03-06-06': {
    status: 422,
    description: 'Period is closed for modifications',
    message: 'Period is closed for modifications',
  },

  // ============================================================================
  // 04-XX-XX: Bondy AI Service Errors
  // ============================================================================
  '04-01-01': {
    status: 400,
    description: 'Missing or invalid query field in the request body',
    message:
      "The Bondy service could not process your request. The field 'query' is required.",
  },
  '04-01-02': {
    status: 500,
    description: 'Internal error while processing the request in Bondy service',
    message:
      'The Bondy service encountered an unexpected error. Please try again later or contact support.',
  },
  '04-01-03': {
    status: 401,
    description: 'Missing or invalid Authorization header',
    message: 'Authorization header is required. Format: Bearer <token>',
  },
  '04-01-04': {
    status: 400,
    description: "Missing or invalid group_id field in the request body",
    message: "The field 'group_id' is required.",
  },
  '04-01-05': {
    status: 401,
    description: 'Invalid token format',
    message: 'Invalid token format',
  },
  '04-01-06': {
    status: 401,
    description: 'Token has expired',
    message: 'Expired token',
  },

  // ============================================================================
  // 99-XX-XX: General System Errors
  // ============================================================================

  // Entity Processing Errors (99-01-XX)
  '99-01-01': {
    status: 422,
    description: 'Error Al prosesar la entidad, no coincide con la espera o falta campos',
    message:
      'Error: Los datos de tu solicitud no se enviaron correctamente, por favor intentarlo mas tarde o ponerte en contacto con soporte',
  },
  '99-01-02': {
    status: 422,
    description: 'Error Al deserializar la entidad, sintaxis incorrecta de JSON',
    message:
      'Error: Los datos de tu solicitud no se enviaron correctamente, por favor intentarlo mas tarde o ponerte en contacto con soporte',
  },
  '99-01-03': {
    status: 422,
    description: 'La entidad no pasa las validaciones basicas de las reglas de negocio',
    message: 'Error: El campo {field} no es valido porque {reason}',
  },

  // Authentication Errors (99-02-XX)
  '99-02-01': {
    status: 403,
    description: 'No se envio El JWT',
    message: 'No autorizado - Token requerido',
  },
  '99-02-03': {
    status: 401,
    description: 'Error en token',
    message: 'Authentication failed',
  },

  // Database & Connection Errors (99-03-XX)
  '99-03-01': {
    status: 500,
    description: 'No se pudo conectar a la db',
    message: 'Error: No pudimos recuperar tus datos, intentalos despues nuevamente',
  },
  '99-03-02': {
    status: 502,
    description: 'No se pudo connectar a una api del sistema',
    message: 'CONNECT_MICRO_ERROR',
  },
  '99-03-03': {
    status: 400,
    description: 'Tipo de dato inválido',
    message: 'Invalid data type',
  },
  '99-03-04': {
    status: 400,
    description: 'Longitud inválida',
    message: 'Invalid field length',
  },
  '99-03-05': {
    status: 408,
    description: 'Request timeout',
    message: 'La solicitud está tardando demasiado. Por favor intenta nuevamente.',
  },

  // General Authorization Errors (99-04-XX)
  '99-04-01': {
    status: 401,
    description: 'No autorizado',
    message: 'Not authorized',
  },
  '99-04-02': {
    status: 401,
    description: 'Token inválido',
    message: 'Invalid authentication token',
  },
};

/**
 * Default error messages by HTTP status code
 */
export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Solicitud incorrecta. Por favor verifica los datos enviados.',
  401: 'No autorizado. Por favor inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'Recurso no encontrado.',
  408: 'Tiempo de espera agotado. Por favor intenta nuevamente.',
  409: 'El recurso ya existe.',
  422: 'Los datos proporcionados no son válidos.',
  429: 'Demasiadas solicitudes. Por favor intenta más tarde.',
  500: 'Error del servidor. Por favor intenta más tarde.',
  502: 'Error de conexión con el servicio.',
  503: 'Servicio no disponible. Por favor intenta más tarde.',
};

/**
 * Fallback error message
 */
export const FALLBACK_ERROR_MESSAGE =
  'Ocurrió un error inesperado. Por favor intenta nuevamente.';
