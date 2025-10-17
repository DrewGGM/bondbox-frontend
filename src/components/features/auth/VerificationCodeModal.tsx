import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { VerificationCodeInput } from './VerificationCodeInput';

interface VerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading?: boolean;
}

export const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
  onResend,
  isLoading = false,
}) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleCodeComplete = (completedCode: string) => {
    setCode(completedCode);
  };

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    setCode('');
    onResend();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <Mail size={48} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Código de Verificación
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-2">
          Hemos enviado un código de 6 dígitos a
        </p>
        <p className="text-primary font-semibold text-center mb-8">
          {email}
        </p>

        {/* Code Input Label */}
        <label className="block text-gray-700 font-medium text-center mb-4">
          Ingresa el código
        </label>

        {/* 6-Digit Input */}
        <div className="mb-8">
          <VerificationCodeInput
            length={6}
            onComplete={handleCodeComplete}
            disabled={isLoading}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={code.length !== 6 || isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-6"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando...
            </>
          ) : (
            'Verificar Código'
          )}
        </button>

        {/* Resend Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            ¿No recibiste el código?
          </p>
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary font-semibold hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            Reenviar código
          </button>
        </div>
      </div>
    </div>
  );
};
