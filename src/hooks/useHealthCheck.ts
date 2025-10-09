import { useState, useEffect } from 'react';
import { apiClient } from '@/api/axios.config';
import { ENDPOINTS } from '@/api/endpoints';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'checking';
  mcp_connected: boolean;
  server_path?: string;
  lastChecked?: Date;
  error?: string;
}

export const useHealthCheck = (intervalMs: number = 30000) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: 'checking',
    mcp_connected: false,
  });

  const checkHealth = async () => {
    try {
      setHealthStatus(prev => ({ ...prev, status: 'checking' }));
      
      const response = await apiClient.get(ENDPOINTS.HEALTH);
      const data = response.data;
      
      setHealthStatus({
        status: data.status === 'healthy' ? 'healthy' : 'unhealthy',
        mcp_connected: data.mcp_connected || false,
        server_path: data.server_path,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({
        status: 'unhealthy',
        mcp_connected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    // Check immediately
    checkHealth();
    
    // Set up interval
    const interval = setInterval(checkHealth, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return {
    healthStatus,
    checkHealth,
    isHealthy: healthStatus.status === 'healthy',
    isMCPConnected: healthStatus.mcp_connected,
  };
};
