import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { HomePage } from '@/pages/HomePage';

export const HomeRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si está autenticado, redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, muestra el home
  return <HomePage />;
};
