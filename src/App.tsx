import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import './styles/globals.css';

function App() {
  const { initialize, isLoading, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex gap-4 justify-center">
            <div className="w-12 h-12 bg-primary rounded-lg animate-pulse"></div>
            <div className="w-12 h-12 bg-primary-dark rounded-lg animate-pulse delay-75"></div>
            <div className="w-12 h-12 bg-secondary rounded-lg animate-pulse delay-150"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
