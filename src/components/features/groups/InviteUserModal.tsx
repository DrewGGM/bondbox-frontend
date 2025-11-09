import React, { useState, useEffect } from 'react';
import { X, UserPlus, Calendar } from 'lucide-react';
import type { RolInfo } from '@/types/groups.types';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteUser: (userId: string, roleId: string, expiresIn: Date) => void;
  roles: RolInfo[];
  isLoading?: boolean;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInviteUser,
  roles,
  isLoading = false,
}) => {
  const [userId, setUserId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [minDate, setMinDate] = useState('');

  // Set minimum date (tomorrow) and default expiration date (7 days from now)
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const defaultExpiration = new Date();
      defaultExpiration.setDate(defaultExpiration.getDate() + 7);
      defaultExpiration.setHours(23, 59, 59, 999);

      // Format for datetime-local input (YYYY-MM-DDThh:mm)
      setMinDate(formatDateTimeLocal(tomorrow));
      setExpirationDate(formatDateTimeLocal(defaultExpiration));
    }
  }, [isOpen]);

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim() && selectedRoleId && expirationDate) {
      // Convert to ISO string format: 2026-10-25T13:09:42.912Z
      const expiresIn = new Date(expirationDate);
      console.log('Expiration date (ISO format):', expiresIn.toISOString());

      onInviteUser(userId.trim(), selectedRoleId, expiresIn);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUserId('');
      setSelectedRoleId('');
      setExpirationDate('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <UserPlus size={40} className="text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Invitar Persona
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">
          Ingresa el ID del usuario y selecciona un rol para enviar la invitación
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* User ID Input */}
          <div className="mb-6">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ID del Usuario
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Pega el ID del usuario aquí"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400"
              disabled={isLoading}
              autoFocus
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              El usuario puede encontrar su ID en el menú de configuración
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label
              htmlFor="roleId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rol Inicial
            </label>
            <select
              id="roleId"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
              disabled={isLoading}
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.rolName}
                </option>
              ))}
            </select>
          </div>

          {/* Expiration Date */}
          <div className="mb-6">
            <label
              htmlFor="expirationDate"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              Fecha de Expiración
            </label>
            <input
              id="expirationDate"
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              min={minDate}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              La invitación expirará automáticamente en esta fecha
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!userId.trim() || !selectedRoleId || !expirationDate || isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Enviar Invitación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
