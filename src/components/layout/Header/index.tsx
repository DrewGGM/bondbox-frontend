import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, ChevronDown } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import { UserMenu } from './UserMenu';
import { NotificationBell } from './NotificationBell';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedGroup } = useGroupStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-primary-dark h-16 flex items-center justify-between px-4 md:px-6 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-12 w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <svg
            className="w-7 h-7 md:w-9 md:h-9"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path
              d="M18 6 L6 15 L6 28 L30 28 L30 15 Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M3 16.5 L18 4.5 L33 16.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 20 C15.5 17.5, 10.5 17.5, 10.5 21 C10.5 24.5, 18 27, 18 27 C18 27, 25.5 24.5, 25.5 21 C25.5 17.5, 20.5 17.5, 18 20Z"
              fill="#F28627"
            />
          </svg>
          <span className="text-white text-lg md:text-2xl font-bold">
            BondBox
          </span>
        </div>

        {/* Selected Group Display */}
        {selectedGroup && (
          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-medium truncate max-w-[150px]">
              {selectedGroup.name}
            </span>
            <ChevronDown className="w-3 h-3 text-white/60" />
          </Link>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 flex-1">
          <Link
            to="/dashboard"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/dashboard')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/finanzas"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/finanzas')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Finanzas
          </Link>
          <Link
            to="/tareas"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/tareas')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Tareas
          </Link>
          <Link
            to="/calendario"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/calendario')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Calendario
          </Link>
          <Link
            to="/momentos"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/momentos')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Momentos
          </Link>
          <Link
            to="/inventario"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/inventario')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Inventario
          </Link>
          <Link
            to="/bondy-ai"
            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive('/bondy-ai')
                ? 'bg-primary text-white'
                : 'text-white/80 hover:text-white hover:bg-primary/20'
            }`}
          >
            Bondy AI
          </Link>
        </nav>

        {/* Notificaciones y User Menu - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <NotificationBell />
          <UserMenu />
        </div>

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
            <Link
              to="/dashboard"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/finanzas"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/finanzas')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Finanzas
            </Link>
            <Link
              to="/tareas"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/tareas')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tareas
            </Link>
            <Link
              to="/calendario"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/calendario')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Calendario
            </Link>
            <Link
              to="/momentos"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/momentos')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Momentos
            </Link>
            <Link
              to="/inventario"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/inventario')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inventario
            </Link>
            <Link
              to="/bondy-ai"
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/bondy-ai')
                  ? 'bg-primary text-white'
                  : 'text-white/80 hover:text-white hover:bg-primary/20'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Bondy AI
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
