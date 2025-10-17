import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* BondBox Logo */}
        <div className="flex justify-center mb-6">
          <svg className="w-24 h-24" viewBox="0 0 36 36" fill="none">
            <path d="M18 6 L6 15 L6 28 L30 28 L30 15 Z" fill="#F28627" opacity="0.9"/>
            <path d="M3 16.5 L18 4.5 L33 16.5" stroke="#F28627" strokeWidth="2" strokeLinecap="round"/>
            <path
              d="M18 20 C15.5 17.5, 10.5 17.5, 10.5 21 C10.5 24.5, 18 27, 18 27 C18 27, 25.5 24.5, 25.5 21 C25.5 17.5, 20.5 17.5, 18 20Z"
              fill="#BC3503"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* 404 Number */}
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">404</h1>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Página no encontrada
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <Home size={20} />
              Ir al inicio
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              Volver atrás
            </button>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-sm text-gray-600">
          <p>¿Necesitas ayuda? Contacta con soporte</p>
        </div>
      </div>
    </div>
  );
};
