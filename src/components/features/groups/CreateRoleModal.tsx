import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import type { PermsConfig } from '@/types/groups.types';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRole: (roleName: string, permissions: PermsConfig) => void;
  isLoading?: boolean;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onCreateRole,
  isLoading = false,
}) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<PermsConfig>({
    invitePeople: false,
    kickPeople: false,
    createTask: false,
    deleteTask: false,
    updateTask: false,
    createInventory: false,
    deleteInventory: false,
    updateInventory: false,
    createFinances: false,
    deleteFinances: false,
    updateFinances: false,
    createRol: false,
    editable: true,
    updateRol: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleName.trim()) {
      onCreateRole(roleName.trim(), permissions);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRoleName('');
      setPermissions({
        invitePeople: false,
        kickPeople: false,
        createTask: false,
        deleteTask: false,
        updateTask: false,
        createInventory: false,
        deleteInventory: false,
        updateInventory: false,
        createFinances: false,
        deleteFinances: false,
        updateFinances: false,
        createRol: false,
        editable: true,
        updateRol: false,
      });
      onClose();
    }
  };

  const togglePermission = (key: keyof PermsConfig) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 my-8 animate-slideUp">
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
            <Shield size={40} className="text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Crear Nuevo Rol
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">
          Define el nombre y los permisos del nuevo rol
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Role Name Input */}
          <div className="mb-6">
            <label
              htmlFor="roleName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Rol
            </label>
            <input
              id="roleName"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Ej: Administrador, Moderador, Miembro"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 placeholder-gray-400"
              disabled={isLoading}
              autoFocus
              required
            />
          </div>

          {/* Permissions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permisos
            </label>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* People Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Gestión de Personas</p>
                <div className="space-y-2">
                  <PermissionCheckbox
                    label="Invitar personas"
                    checked={permissions.invitePeople}
                    onChange={() => togglePermission('invitePeople')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Expulsar personas"
                    checked={permissions.kickPeople}
                    onChange={() => togglePermission('kickPeople')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Task Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tareas</p>
                <div className="space-y-2">
                  <PermissionCheckbox
                    label="Crear tareas"
                    checked={permissions.createTask}
                    onChange={() => togglePermission('createTask')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Eliminar tareas"
                    checked={permissions.deleteTask}
                    onChange={() => togglePermission('deleteTask')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Actualizar tareas"
                    checked={permissions.updateTask}
                    onChange={() => togglePermission('updateTask')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Inventory Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Inventario</p>
                <div className="space-y-2">
                  <PermissionCheckbox
                    label="Crear inventario"
                    checked={permissions.createInventory}
                    onChange={() => togglePermission('createInventory')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Eliminar inventario"
                    checked={permissions.deleteInventory}
                    onChange={() => togglePermission('deleteInventory')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Actualizar inventario"
                    checked={permissions.updateInventory}
                    onChange={() => togglePermission('updateInventory')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Finance Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Finanzas</p>
                <div className="space-y-2">
                  <PermissionCheckbox
                    label="Crear finanzas"
                    checked={permissions.createFinances}
                    onChange={() => togglePermission('createFinances')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Eliminar finanzas"
                    checked={permissions.deleteFinances}
                    onChange={() => togglePermission('deleteFinances')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Actualizar finanzas"
                    checked={permissions.updateFinances}
                    onChange={() => togglePermission('updateFinances')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Role Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Roles</p>
                <div className="space-y-2">
                  <PermissionCheckbox
                    label="Crear roles"
                    checked={permissions.createRol}
                    onChange={() => togglePermission('createRol')}
                    disabled={isLoading}
                  />
                  <PermissionCheckbox
                    label="Actualizar roles"
                    checked={permissions.updateRol}
                    onChange={() => togglePermission('updateRol')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
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
              disabled={!roleName.trim() || isLoading}
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
                  Creando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Crear Rol
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component for permission checkboxes
const PermissionCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);
