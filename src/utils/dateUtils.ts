/**
 * Utilidad para manejar conversión de timestamps del backend a la zona horaria local
 */

/**
 * Convierte un timestamp del backend (que puede venir con precisión de nanosegundos)
 * a un objeto Date de JavaScript en la zona horaria local
 */
export function parseBackendTimestamp(timestamp: Date | string | number): Date {
  if (!timestamp) {
    return new Date();
  }

  // Si ya es un objeto Date, retornarlo
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Convertir a string
  const timestampStr = typeof timestamp === 'string'
    ? timestamp
    : String(timestamp);

  // Truncar nanosegundos si existen (mantener solo milisegundos)
  // El backend de Java puede enviar timestamps con precisión de nanosegundos
  // Ejemplo: 2025-11-13T18:25:49.095956557
  // JavaScript solo soporta milisegundos: 2025-11-13T18:25:49.095
  const truncated = timestampStr.replace(/(\.\d{3})\d+/, '$1');

  // Crear el objeto Date
  // JavaScript automáticamente convierte UTC a hora local del navegador
  return new Date(truncated);
}

/**
 * Ordena un array de objetos por su propiedad timestamp
 * @param messages Array de objetos con propiedad timestamp
 * @returns Array ordenado de más antiguo a más reciente
 */
export function sortMessagesByTimestamp<T extends { timestamp: Date | string }>(
  messages: T[]
): T[] {
  return [...messages].sort((a, b) => {
    const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
    const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Formatea una fecha a formato de hora local (HH:MM)
 */
export function formatTime(timestamp: Date | string): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea una fecha a formato legible (Hoy, Ayer, o fecha completa)
 */
export function formatDate(timestamp: Date | string): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
