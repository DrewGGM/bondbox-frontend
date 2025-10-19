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
    description: 'La fecha de nacimiento esta en el futuro',
    message: 'Error: La fecha de nacimiento es invalida',
  },
  '01-01-02': {
    status: 409,
    description: 'Usuario ya registrado',
    message: 'Ya estas registrado, porfavor redirigete al login',
  },
  '01-01-03': {
    status: 409,
    description: 'Nit ya en uso',
    message: 'Ya estas registrado con este NIT, porfavor redirigete al login',
  },
  '01-01-04': {
    status: 404,
    description: 'User con ese mail no encontrado',
    message:
      'Este email no esta registrado en nuestro sistema, porfavor contactarte con el equipo de soporte si crees que es un error',
  },
  '01-01-05': {
    status: 401,
    description: 'OTP invalido',
    message:
      'Este OTP parece incorrecto.. pero no se preocupes aun puedes intentar escribiendolo correctamente',
  },
  '01-01-06': {
    status: 401,
    description: 'OTP caducado o inexistente',
    message:
      'Parece que ya has llegado al limite de intentos validos por OTP enviado, intenta generar uno nuevo',
  },
  '01-01-07': {
    status: 401,
    description: 'Credenciales invalidas',
    message: 'Contraseña o Correo Incorrecto',
  },
  '01-02-01': {
    status: 404,
    description: 'No se pudo encontrar el usuario asignado',
    message: 'Error: No pudimos recuperar tu identidad, porfavor contactar a soporte',
  },

  // ============================================================================
  // 02-XX-XX: Group & User Management Errors
  // ============================================================================
  '02-01-01': {
    status: 404,
    description: 'No se encontro el usuaio en el grupo asignado',
    message: 'No se encontró tu usuario en el grupo',
  },
  '02-01-02': {
    status: 404,
    description: 'No se encontro el grupo',
    message: 'El grupo no fue encontrado',
  },
  '02-01-03': {
    status: 404,
    description: 'Grupo no encontrado con ese Unique union code',
    message: 'No se encontró ningún grupo con ese código de unión',
  },
  '02-02-01': {
    status: 403,
    description: 'El usuario no tiene permisos para realizar esta accion en el grupo',
    message: 'No tienes permisos para realizar esta acción en el grupo',
  },
  '02-02-02': {
    status: 403,
    description: 'No puedes asignar',
    message: 'No puedes asignar el rol de administrador',
  },
  '02-02-03': {
    status: 404,
    description: 'El usuario al que se quiere resignar el rol no esta en el grupo',
    message: 'El usuario al que intentas asignar el rol no está en el grupo',
  },
  '02-02-04': {
    status: 404,
    description: 'Rol no fue encontrado',
    message: 'El rol especificado no fue encontrado',
  },
  '02-02-05': {
    status: 409,
    description: 'Rol en uso',
    message: 'No puedes eliminar un rol que está en uso',
  },
  '02-02-06': {
    status: 409,
    description: 'Se intento eliminar el rol Admin',
    message: 'No puedes eliminar el rol de administrador',
  },
  '02-03-01': {
    status: 400,
    description: 'El usuario ya esta en ese grupo',
    message: 'El usuario ya es miembro de este grupo',
  },
  '02-03-02': {
    status: 400,
    description: 'El rol inicial de la invitacion no es valido o no le pertenece al grupo',
    message: 'El rol de la invitación no es válido para este grupo',
  },
  '02-03-03': {
    status: 400,
    description: 'El usuario ya esta invitado',
    message: 'Este usuario ya tiene una invitación pendiente',
  },
  '02-03-04': {
    status: 400,
    description: 'La invitacion no le pertenece al usuario',
    message: 'Esta invitación no te pertenece',
  },
  '02-03-05': {
    status: 404,
    description: 'Invitacion No encontrada',
    message: 'La invitación no fue encontrada',
  },
  '02-03-06': {
    status: 400,
    description: 'Invitacion en status invalido',
    message: 'La invitación no está en un estado válido',
  },
  '02-04-01': {
    status: 400,
    description: 'Usuario ya mando solicitud de union anteriormente',
    message: 'Ya has enviado una solicitud de unión anteriormente',
  },
  '02-04-02': {
    status: 404,
    description: 'La solicitud de union no existe',
    message: 'La solicitud de unión no fue encontrada',
  },

  // ============================================================================
  // 03-XX-XX: Finance & Transaction Errors
  // ============================================================================

  // Transaction Errors (03-01-XX)
  '03-01-01': {
    status: 404,
    description: 'Transaction not found',
    message: 'No se encontró la transacción',
  },
  '03-01-02': {
    status: 400,
    description: 'Invalid transaction amount',
    message: 'El monto de la transacción no es válido',
  },
  '03-01-03': {
    status: 400,
    description: 'Invalid transaction type',
    message: 'El tipo de transacción no es válido',
  },
  '03-01-05': {
    status: 422,
    description: 'Transaction limit exceeded',
    message: 'Se ha excedido el límite de transacciones',
  },
  '03-01-06': {
    status: 409,
    description: 'Duplicate transaction',
    message: 'Esta transacción ya existe',
  },
  '03-01-07': {
    status: 500,
    description: 'Failed to update transaction',
    message: 'No se pudo actualizar la transacción',
  },
  '03-01-08': {
    status: 500,
    description: 'Failed to delete transaction',
    message: 'No se pudo eliminar la transacción',
  },
  '03-01-09': {
    status: 422,
    description: 'Insufficient balance',
    message: 'Saldo insuficiente',
  },

  // Category Errors (03-02-XX)
  '03-02-01': {
    status: 404,
    description: 'Category not found',
    message: 'No se encontró la categoría',
  },
  '03-02-02': {
    status: 409,
    description: 'Category name already exists',
    message: 'Ya existe una categoría con ese nombre',
  },
  '03-02-03': {
    status: 422,
    description: 'Category is in use',
    message: 'La categoría está en uso y no puede eliminarse',
  },
  '03-02-04': {
    status: 400,
    description: 'Invalid category type',
    message: 'El tipo de categoría no es válido',
  },
  '03-02-08': {
    status: 400,
    description: 'Category type mismatch',
    message: 'El tipo de categoría no coincide',
  },

  // Budget Errors (03-03-XX)
  '03-03-01': {
    status: 404,
    description: 'Budget not found',
    message: 'No se encontró el presupuesto',
  },
  '03-03-02': {
    status: 422,
    description: 'Budget limit exceeded',
    message: 'Se ha excedido el límite del presupuesto',
  },
  '03-03-03': {
    status: 409,
    description: 'Budget already exists for this category',
    message: 'Ya existe un presupuesto para esta categoría',
  },
  '03-03-04': {
    status: 400,
    description: 'Invalid budget amount',
    message: 'El monto del presupuesto no es válido',
  },
  '03-03-05': {
    status: 500,
    description: 'Invalid budget period',
    message: 'El período del presupuesto no es válido',
  },
  '03-03-06': {
    status: 500,
    description: 'Failed to update budget',
    message: 'No se pudo actualizar el presupuesto',
  },
  '03-03-07': {
    status: 500,
    description: 'Failed to delete budget',
    message: 'No se pudo eliminar el presupuesto',
  },
  '03-03-08': {
    status: 400,
    description: 'Invalid alert threshold',
    message: 'El umbral de alerta no es válido',
  },

  // Report Errors (03-04-XX)
  '03-04-02': {
    status: 400,
    description: 'Invalid report period',
    message: 'El período del reporte no es válido',
  },

  // Export Errors (03-05-XX)
  '03-05-01': {
    status: 400,
    description: 'Export format not supported',
    message: 'El formato de exportación no es compatible',
  },

  // General Finance Errors (03-06-XX)
  '03-06-01': {
    status: 404,
    description: 'Group not found',
    message: 'No se encontró el grupo',
  },
  '03-06-02': {
    status: 403,
    description: 'User does not belong to this group',
    message: 'No perteneces a este grupo',
  },
  '03-06-03': {
    status: 400,
    description: 'Invalid currency',
    message: 'La moneda no es válida',
  },
  '03-06-05': {
    status: 400,
    description: 'Transaction date cannot be in the future',
    message: 'La fecha de la transacción no puede ser futura',
  },
  '03-06-06': {
    status: 422,
    description: 'Period is closed for modifications',
    message: 'El período está cerrado y no se pueden hacer modificaciones',
  },

  // ============================================================================
  // 04-XX-XX: Bondy AI Service Errors
  // ============================================================================
  '04-01-01': {
    status: 400,
    description: 'Missing or invalid query field in the request body',
    message:
      'El servicio Bondy no pudo procesar tu solicitud. El campo consulta es requerido.',
  },
  '04-01-02': {
    status: 500,
    description: 'Internal error while processing the request in Bondy service',
    message:
      'El servicio Bondy encontró un error inesperado. Por favor intenta más tarde o contacta a soporte.',
  },
  '04-01-03': {
    status: 401,
    description: 'Missing or invalid Authorization header',
    message: 'Se requiere autorización. Formato: Bearer <token>',
  },
  '04-01-04': {
    status: 400,
    description: "Missing or invalid group_id field in the request body",
    message: "El campo 'group_id' es requerido.",
  },
  '04-01-05': {
    status: 401,
    description: 'Invalid token format',
    message: 'Formato de token inválido',
  },
  '04-01-06': {
    status: 401,
    description: 'Expired token',
    message: 'El token ha expirado',
  },

  // ============================================================================
  // 99-XX-XX: General System Errors
  // ============================================================================

  // Entity Processing Errors (99-01-XX)
  '99-01-01': {
    status: 422,
    description: 'Error Al prosesar la entidad, no coincide con la espera o falta campos',
    message:
      'Error: Los datos de tu solicitud no se enviaron Correctamente , Porvafor intentarlo mas tarde o ponerte en contacto con soporte',
  },
  '99-01-02': {
    status: 422,
    description: 'Error Al deserializar la entidad, sintaxis incorrecta de JSON ',
    message:
      'Error: Los datos de tu solicitud no se enviaron Correctamente , Porvafor intentarlo mas tarde o ponerte en contacto con soporte',
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
    status: 500,
    description: 'Error en transacción',
    message: 'La transacción falló',
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
    message: 'Error al conectar con el servicio. Por favor intenta más tarde',
  },
  '99-03-03': {
    status: 400,
    description: 'Tipo de dato inválido',
    message: 'El tipo de dato enviado no es válido',
  },
  '99-03-04': {
    status: 400,
    description: 'Longitud inválida',
    message: 'La longitud del campo no es válida',
  },
  '99-03-05': {
    status: 408,
    description: 'Time out',
    message: 'La solicitud está tardando demasiado. Por favor intenta nuevamente.',
  },

  // General Authorization Errors (99-04-XX)
  '99-04-01': {
    status: 401,
    description: 'No autorizado',
    message: 'No tienes autorización para realizar esta acción',
  },
  '99-04-02': {
    status: 401,
    description: 'Token inválido',
    message: 'El token de autenticación no es válido',
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
