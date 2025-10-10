import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary-dark h-16 flex items-center justify-between px-4 md:px-6 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-12 w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <svg className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 36 36" fill="none">
            <path d="M18 6 L6 15 L6 28 L30 28 L30 15 Z" fill="white" opacity="0.9"/>
            <path d="M3 16.5 L18 4.5 L33 16.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 20 C15.5 17.5, 10.5 17.5, 10.5 21 C10.5 24.5, 18 27, 18 27 C18 27, 25.5 24.5, 25.5 21 C25.5 17.5, 20.5 17.5, 18 20Z"
                  fill="#F28627"/>
          </svg>
          <span className="text-white text-lg md:text-2xl font-bold">BondBox</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 flex-1">
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Dashboard
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Finanzas
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Tareas
          </a>
          <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2">
            Calendario
          </a>
          <a href="#" className="bg-primary text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            Bondy AI
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden ml-auto text-white p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-primary-dark shadow-lg border-t border-primary/20">
          <nav className="flex flex-col p-4 gap-2">
            <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300">
              Dashboard
            </a>
            <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300">
              Finanzas
            </a>
            <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300">
              Tareas
            </a>
            <a href="#" className="text-white/80 hover:text-white hover:bg-primary/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300">
              Calendario
            </a>
            <a href="#" className="bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium">
              Bondy AI
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
