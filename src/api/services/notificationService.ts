import axios from 'axios';
import apiErrorHandler from '@/utils/apiErrorHandler';
import { STORAGE_KEYS } from '@/config/storageKeys';
import type { ResponseNotificationDTO } from '@/types/notification.types';

export interface NotificationService {
  obtenerNotificacionesPorUsuario(
    userId: string
  ): Promise<ResponseNotificationDTO[]>;
  marcarComoLeida(id: string): Promise<ResponseNotificationDTO>;
}

export class NotificationServiceImp implements NotificationService {
  async obtenerNotificacionesPorUsuario(
    userId: string
  ): Promise<ResponseNotificationDTO[]> {
    try {
      // authenticatedHttpInstance tiene baseURL: ${BASE_URL}/api/v1
      // El endpoint de comunicación está en: /api/communication/notifications
      // Necesitamos salir del prefijo /api/v1 y usar /api/communication directamente
      // Construimos la URL completa sin el prefijo v1
      // El endpoint de notificaciones está en el API Gateway
      // https://api.bond-box.shop/api/notificaciones/usuario/{userId}
      const NOTIFICATIONS_BASE_URL = 'https://api.bond-box.shop';
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const url = `${NOTIFICATIONS_BASE_URL}/api/notificaciones/usuario/${userId}`;
      console.log('🔔 URL de notificaciones:', url);

      const response = await axios.get<ResponseNotificationDTO[]>(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw apiErrorHandler(error);
    }
  }

  async marcarComoLeida(id: string): Promise<ResponseNotificationDTO> {
    try {
      // El endpoint de notificaciones está en el API Gateway
      // https://api.bond-box.shop/api/notificaciones/{id}/marcar-leida
      const NOTIFICATIONS_BASE_URL = 'https://api.bond-box.shop';
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      const url = `${NOTIFICATIONS_BASE_URL}/api/notificaciones/${id}/marcar-leida`;
      console.log('🔔 URL para marcar como leída:', url);

      const response = await axios.put<ResponseNotificationDTO>(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw apiErrorHandler(error);
    }
  }
}

export const notificationService = new NotificationServiceImp();
