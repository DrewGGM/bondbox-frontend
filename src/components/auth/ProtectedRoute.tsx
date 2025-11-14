import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { FloatingChatButton } from '@/components/features/chat/FloatingChatButton';
import { ChatWindow } from '@/components/features/chat/ChatWindow';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Simple synchronous check - auth is already verified in App.tsx
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      <FloatingChatButton />
      <ChatWindow />
    </>
  );
};
