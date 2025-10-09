import axios from 'axios';

const GROUP_ID = import.meta.env.VITE_HARDCODED_GROUP_ID;
const JWT_TOKEN = import.meta.env.VITE_HARDCODED_JWT_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

export interface AIQueryRequest {
  query: string;
  group_id: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'EXPENSE' | 'INCOME';
  transaction_date: string;
  category_id: string;
  category: {
    id: string;
    name: string;
    type: 'EXPENSE' | 'INCOME';
    color: string;
    group_id: string;
    created_at: string;
  };
  group_id: string;
  user_id: string;
  created_at: string;
}

export interface AIQueryResponse {
  client_response: string;
  data?: unknown; // Datos estructurados del agente MCP
}

export const aiService = {
  async queryAI(query: string): Promise<AIQueryResponse> {
    try {
      if (!GROUP_ID || !JWT_TOKEN) {
        throw new Error('Configuración de autenticación faltante. Verifica las variables de entorno VITE_HARDCODED_GROUP_ID y VITE_HARDCODED_JWT_TOKEN.');
      }

      const requestData: AIQueryRequest = {
        query,
        group_id: GROUP_ID,
      };

      const fullURL = `${API_BASE_URL}/api/v1/query`;

      const response = await axios.post(fullURL, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT_TOKEN}`,
        },
        timeout: 60000, // 1 minutos para permitir que el agente ejecute herramientas
      });

      return response.data;
    } catch (error: unknown) {
      console.error('AI Query Error:', error);
      
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
        throw new Error('El agente está tardando más de lo esperado. Por favor, intenta de nuevo.');
      }
      
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response) {
        const status = (error.response as { status: number }).status;
        if (status === 401) {
          throw new Error('Error de autenticación. Verifica el token.');
        }
        if (status === 404) {
          throw new Error('Endpoint no encontrado. Verifica la configuración del servidor.');
        }
        if (status >= 500) {
          throw new Error('Error del servidor. El agente puede estar procesando tu solicitud.');
        }
      }
      
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string' && error.message.includes('Network Error')) {
        throw new Error('Error de conexión. Verifica que el agente esté ejecutándose.');
      }
      
      const message = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' 
        ? error.message 
        : 'Error desconocido';
      throw new Error(`Error al consultar el agente: ${message}`);
    }
  },
};
