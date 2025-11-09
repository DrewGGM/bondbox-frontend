import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Lock, Copy, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUser } from '@/hooks/useUser';
import { ChangePasswordModal } from '@/components/common/ChangePasswordModal';
import credentialManager from '@/utils/credentialManager';
import toast from 'react-hot-toast';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { changePassword, isLoading } = useUser();

  // Load user ID from token on mount and when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const id = credentialManager.getUserId();
      setUserId(id);
      console.log('User ID from token:', id); // Debug log
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleProfile = () => {
    // TODO: Implementar navegación a perfil
    console.log('Navegar a perfil');
    setIsOpen(false);
  };

  const handleSettings = () => {
    // TODO: Implementar navegación a configuraciones
    console.log('Navegar a configuraciones');
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    setShowChangePasswordModal(true);
  };

  const handlePasswordSubmit = async (oldPassword: string, newPassword: string) => {
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success('Contraseña cambiada exitosamente');
      setShowChangePasswordModal(false);
    } catch (error: any) {
      // Error is already set in the hook and will be displayed
      // The modal will stay open
    }
  };

  const handleCopyUserId = async () => {
    if (userId) {
      try {
        await navigator.clipboard.writeText(userId);
        setIdCopied(true);
        toast.success('ID de usuario copiado');
        setTimeout(() => setIdCopied(false), 2000);
      } catch (error) {
        toast.error('Error al copiar el ID');
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
          {/* Profile Option */}
          <button
            onClick={handleProfile}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Mi Perfil</p>
              <p className="text-xs text-gray-500">Ver y editar perfil</p>
            </div>
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          {/* Settings Option */}
          <button
            onClick={handleSettings}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">Configuración</span>
          </button>

          {/* Change Password Option */}
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">Cambiar Contraseña</span>
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          {/* User ID Section */}
          <div className="px-4 py-3 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-2">Tu ID de Usuario</p>
            {userId ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 flex-1 truncate">
                    {userId}
                  </code>
                  <button
                    onClick={handleCopyUserId}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5 rounded transition-colors flex-shrink-0"
                  >
                    {idCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Comparte este ID para que otros te inviten a grupos
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500 py-2">No se pudo cargar el ID de usuario</p>
            )}
          </div>
          <div className="border-t border-gray-100 my-1"></div>

          {/* Logout Option */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
