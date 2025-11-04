import React from 'react';
import { X, LogOut } from 'lucide-react';

interface LeaveGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isLoading?: boolean;
}

export const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-slideUp">
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
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <LogOut size={40} className="text-orange-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Salir del Grupo
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-2">
          ¿Estás seguro de que deseas salir del grupo <span className="font-semibold text-gray-900">"{groupName}"</span>?
        </p>
        <p className="text-gray-500 text-sm text-center mb-8">
          Perderás acceso a todos los recursos del grupo.
        </p>

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
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                Saliendo...
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-2" />
                Salir del Grupo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
