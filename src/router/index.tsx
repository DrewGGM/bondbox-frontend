import { createBrowserRouter } from 'react-router-dom';
import { BondyAIPage } from '@/pages/ai/BondyAIPage';
import { FinancePage } from '@/pages/finance/FinancePage';
import { DashboardPage } from '@/pages/groups/GroupsPage';
import { GroupDetailsPage } from '@/pages/groups/GroupDetailsPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { ShoppingListPage } from '@/pages/inventory/ShoppingListPage';
import { MomentsPage } from '@/pages/moments/MomentsPage';
import { TasksPage } from '@/pages/tasks/TasksPage';
import { CalendarPage } from '@/pages/calendar/CalendarPage';
import { LoginPage } from '@/pages/user/LoginPage';
import { RegisterPage } from '@/pages/user/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { HomeRoute } from '@/components/auth/HomeRoute';

// Placeholder pages

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
    path: '/grupos/:groupId',
    element: (
      <ProtectedRoute>
        <GroupDetailsPage />
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
        <TasksPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendario',
    element: (
      <ProtectedRoute>
        <CalendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario',
    element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/inventario/shopping-list',
    element: (
      <ProtectedRoute>
        <ShoppingListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/momentos',
    element: (
      <ProtectedRoute>
        <MomentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bitacora',
    element: (
      <ProtectedRoute>
        <MomentsPage />
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
