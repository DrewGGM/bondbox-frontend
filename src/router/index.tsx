import { createBrowserRouter } from 'react-router-dom';
import { BondyAIPage } from '@/pages/ai/BondyAIPage';
import { FinancePage } from '@/pages/finance/FinancePage';
import { DashboardPage } from '@/pages/groups/GroupsPage';
import { LoginPage } from '@/pages/user/LoginPage';
import { RegisterPage } from '@/pages/user/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { HomeRoute } from '@/components/auth/HomeRoute';

// Placeholder pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-5xl font-bold text-primary mb-4">{title}</h1>
      <p className="text-gray-600 text-lg">Esta página será desarrollada pronto</p>
      <div className="mt-6 flex gap-4 justify-center">
        <div className="w-12 h-12 bg-primary rounded-lg animate-pulse"></div>
        <div className="w-12 h-12 bg-primary-dark rounded-lg animate-pulse delay-75"></div>
        <div className="w-12 h-12 bg-secondary rounded-lg animate-pulse delay-150"></div>
      </div>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRoute />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/finanzas',
    element: (
      <ProtectedRoute>
        <FinancePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tareas',
    element: (
      <ProtectedRoute>
        <PlaceholderPage title="✅ Tareas" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendario',
    element: (
      <ProtectedRoute>
        <PlaceholderPage title="📅 Calendario" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario',
    element: (
      <ProtectedRoute>
        <PlaceholderPage title="📦 Inventario" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bitacora',
    element: (
      <ProtectedRoute>
        <PlaceholderPage title="📸 Bitácora" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bondy-ai',
    element: (
      <ProtectedRoute>
        <BondyAIPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);