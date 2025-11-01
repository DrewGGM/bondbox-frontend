import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

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
    </div>
  );
};
