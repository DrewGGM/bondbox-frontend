import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto auth-scroll">
        <div className="w-full max-w-md py-4">
          {children}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary via-primary to-primary-dark flex flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-white/5 rounded-full"></div>

        {/* Logo and Branding */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* BondBox Logo - matching Header design */}
          <svg className="w-24 h-24 md:w-32 md:h-32" viewBox="0 0 36 36" fill="none">
            <path d="M18 6 L6 15 L6 28 L30 28 L30 15 Z" fill="white" opacity="0.9"/>
            <path d="M3 16.5 L18 4.5 L33 16.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path
              d="M18 20 C15.5 17.5, 10.5 17.5, 10.5 21 C10.5 24.5, 18 27, 18 27 C18 27, 25.5 24.5, 25.5 21 C25.5 17.5, 20.5 17.5, 18 20Z"
              fill="white"
            />
          </svg>

          {/* Brand Name */}
          <h1 className="text-4xl md:text-5xl font-bold">BondBox</h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/90 text-center max-w-xs">
            Crea tu familia y empieza hoy
          </p>
        </div>
      </div>
    </div>
  );
};
