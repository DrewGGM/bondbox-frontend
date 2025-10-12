import { createBrowserRouter } from 'react-router-dom';
import { BondyAIPage } from '@/pages/ai/BondyAIPage';
import { FinancePage } from '@/pages/finance/FinancePage';

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
    element: <PlaceholderPage title="🏠 BondBox" />,
  },
  {
    path: '/auth/login',
    element: <PlaceholderPage title="🔐 Login" />,
  },
  {
    path: '/dashboard',
    element: <PlaceholderPage title="📊 Dashboard" />,
  },
  {
    path: '/finanzas',
    element: <FinancePage />,
  },
  {
    path: '/tareas',
    element: <PlaceholderPage title="✅ Tareas" />,
  },
  {
    path: '/calendario',
    element: <PlaceholderPage title="📅 Calendario" />,
  },
  {
    path: '/inventario',
    element: <PlaceholderPage title="📦 Inventario" />,
  },
  {
    path: '/bitacora',
    element: <PlaceholderPage title="📸 Bitácora" />,
  },
  {
    path: '/bondy-ai',
    element: <BondyAIPage />,
  },
]);