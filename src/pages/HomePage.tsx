import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CheckSquare,
  Calendar,
  Bot,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Bell,
  ChevronRight,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Gestión de Gastos',
      description: 'Controla los ingresos y egresos familiares con categorías personalizadas y reportes detallados.',
      color: 'from-primary to-primary-dark',
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: 'Asignación de Tareas',
      description: 'Organiza las tareas del hogar con sistema de recompensas y notificaciones automáticas.',
      color: 'from-secondary to-primary-darker',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Calendario Compartido',
      description: 'Sincroniza eventos familiares y recibe recordatorios para no olvidar nada importante.',
      color: 'from-primary-dark to-primary-darker',
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'Bondy AI',
      description: 'Asistente inteligente que te ayuda a crear tareas, registrar gastos y optimizar tu organización.',
      color: 'from-primary to-secondary',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Comunicación Interna',
      description: 'Chat grupal y privado para mantener a toda la familia conectada en un solo lugar.',
      color: 'from-secondary to-primary',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguridad y Privacidad',
      description: 'Control de acceso por roles, cifrado de datos y registro de auditoría completo.',
      color: 'from-primary-darker to-primary-dark',
    },
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      text: 'Mejora la organización familiar hasta en un 80%',
    },
    {
      icon: <Bell className="w-6 h-6" />,
      text: 'Notificaciones inteligentes para no olvidar nada',
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: 'Colaboración en tiempo real entre todos los miembros',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                BondBox
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Organización familiar inteligente</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Organiza tu{' '}
                <span className="bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent">
                  familia
                </span>{' '}
                con inteligencia
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                BondBox es la plataforma todo-en-uno que transforma la forma en que tu familia gestiona
                gastos, tareas y eventos. Con nuestro asistente de IA, la organización nunca fue tan fácil.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all"
                >
                  Ver Demo
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="text-primary">{benefit.icon}</div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Familia García</p>
                      <p className="font-semibold text-gray-800">4 miembros activos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-xs font-medium text-green-700">+12%</span>
                      </div>
                      <p className="text-2xl font-bold text-green-800">$2,450</p>
                      <p className="text-xs text-green-600">Ahorros este mes</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">85%</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-800">23/27</p>
                      <p className="text-xs text-blue-600">Tareas completadas</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-800">Bondy AI</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      "He optimizado tus gastos y creado 5 tareas pendientes para esta semana."
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 h-2 bg-gradient-to-r from-primary to-primary-dark rounded-full"></div>
                    <div className="flex-1 h-2 bg-gradient-to-r from-secondary to-primary rounded-full"></div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-primary/20 to-primary-dark/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Todo lo que tu familia necesita{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                en un solo lugar
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre las herramientas que harán de tu hogar un espacio más organizado y colaborativo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}></div>

                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                <div className="mt-4 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Saber más</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary-dark to-secondary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>¡Comienza hoy mismo!</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar la organización de tu familia?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Únete a miles de familias que ya usan BondBox para hacer su vida más fácil, organizada y feliz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Crear cuenta gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Sin límite de miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-sm">IA incluida</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                BondBox
              </span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-gray-600">
                © 2025 BondBox. Organización familiar inteligente.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
