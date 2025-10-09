import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary-dark h-16 flex items-center justify-between px-6 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none">
            <path d="M18 6 L6 15 L6 28 L30 28 L30 15 Z" fill="white" opacity="0.9"/>
            <path d="M3 16.5 L18 4.5 L33 16.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 20 C15.5 17.5, 10.5 17.5, 10.5 21 C10.5 24.5, 18 27, 18 27 C18 27, 25.5 24.5, 25.5 21 C25.5 17.5, 20.5 17.5, 18 20Z"
                  fill="#F28627"/>
          </svg>
          <span className="text-white text-2xl font-bold">BondBox</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-2">
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Dashboard
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Finanzas
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Tareas
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Calendario
          </a>
          <a href="#" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            Bondy AI
          </a>
        </nav>
      </div>
    </header>
  );
};
