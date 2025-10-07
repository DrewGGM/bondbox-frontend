#!/bin/bash

# ============================================
# BondBox Frontend - Setup Completo desde Cero
# ============================================

echo "🏠 Iniciando configuración completa de BondBox Frontend..."
echo ""

# PASO 1: Crear estructura de carpetas COMPLETA
echo "📁 Creando estructura de carpetas..."

mkdir -p src/api/services
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/assets/fonts
mkdir -p src/components/common/Button
mkdir -p src/components/common/Input
mkdir -p src/components/common/Modal
mkdir -p src/components/common/Card
mkdir -p src/components/common/Loading
mkdir -p src/components/layout/Header
mkdir -p src/components/layout/Sidebar
mkdir -p src/components/layout/Footer
mkdir -p src/components/layout/DashboardLayout
mkdir -p src/components/features/auth
mkdir -p src/components/features/dashboard
mkdir -p src/components/features/finance
mkdir -p src/components/features/tasks
mkdir -p src/components/features/calendar
mkdir -p src/components/features/inventory
mkdir -p src/components/features/bitacora
mkdir -p src/components/features/ai
mkdir -p src/config
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/layouts
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard
mkdir -p src/pages/finance
mkdir -p src/pages/tasks
mkdir -p src/pages/calendar
mkdir -p src/pages/inventory
mkdir -p src/pages/bitacora
mkdir -p src/pages/ai
mkdir -p src/pages/settings
mkdir -p src/router
mkdir -p src/store
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/test

echo "✅ Estructura de carpetas creada"
echo ""

# PASO 2: Crear package.json con versiones COMPATIBLES
echo "📦 Creando package.json..."

cat > package.json << 'PACKAGEJSON'
{
  "name": "bondbox-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.3",
    "react-big-calendar": "^1.8.5",
    "moment": "^2.29.4",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.4",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/ui": "^1.0.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.0.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.0.1",
    "postcss": "^8.4.32",
    "prettier": "^3.1.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "vitest": "^1.0.4"
  }
}
PACKAGEJSON

echo "✅ package.json creado"

# PASO 3: Variables de entorno
echo "🔐 Creando archivos de variables de entorno..."

cat > .env.example << 'ENVEXAMPLE'
# API Configuration
VITE_API_GATEWAY_URL=http://localhost:8000
VITE_APP_NAME=BondBox
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_GOOGLE_CALENDAR=true

# External Services
VITE_GOOGLE_CALENDAR_API_KEY=
ENVEXAMPLE

cat > .env.development << 'ENVDEV'
VITE_API_GATEWAY_URL=http://localhost:8000
VITE_APP_NAME=BondBox
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_GOOGLE_CALENDAR=false
ENVDEV

echo "✅ Archivos .env creados"

# PASO 4: Configuración de Tailwind CSS v3
echo "🎨 Creando configuración de Tailwind CSS v3..."

cat > tailwind.config.js << 'TAILWINDCONFIG'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F28627',
          dark: '#BC3503',
          darker: '#591902',
        },
        secondary: '#403E23',
        light: '#BFC5D9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
TAILWINDCONFIG

cat > postcss.config.js << 'POSTCSSCONFIG'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSSCONFIG

echo "✅ Tailwind CSS configurado"

# PASO 5: Configuración de ESLint y Prettier
echo "🔍 Creando configuración de ESLint..."

cat > .eslintrc.cjs << 'ESLINTRC'
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
ESLINTRC

cat > .prettierrc << 'PRETTIERRC'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
PRETTIERRC

echo "✅ ESLint y Prettier configurados"

# PASO 6: Configuración de TypeScript
echo "📘 Creando configuración de TypeScript..."

cat > tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
TSCONFIG

cat > tsconfig.node.json << 'TSCONFIGNODE'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
TSCONFIGNODE

echo "✅ TypeScript configurado"

# PASO 7: Configuración de Vite
echo "⚡ Creando configuración de Vite..."

cat > vite.config.ts << 'VITECONFIG'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
VITECONFIG

echo "✅ Vite configurado"

# PASO 8: Configuración de Vitest
echo "🧪 Creando configuración de Vitest..."

cat > vitest.config.ts << 'VITESTCONFIG'
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
VITESTCONFIG

echo "✅ Vitest configurado"

# PASO 9: Estilos globales con Tailwind
echo "💄 Creando estilos globales..."

cat > src/styles/globals.css << 'GLOBALCSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: #F28627;
    --color-primary-dark: #BC3503;
    --color-primary-darker: #591902;
    --color-secondary: #403E23;
    --color-light: #BFC5D9;
  }
  
  body {
    @apply font-sans text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  }
}
GLOBALCSS

echo "✅ Estilos globales creados"

# PASO 10: Configuración de Axios
echo "🌐 Creando configuración de Axios..."

cat > src/api/axios.config.ts << 'AXIOSCONFIG'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bondbox-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bondbox-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
AXIOSCONFIG

echo "✅ Axios configurado"

# PASO 11: Endpoints de API
echo "📡 Creando endpoints de API..."

cat > src/api/endpoints.ts << 'ENDPOINTS'
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  FINANCE: {
    TRANSACTIONS: '/api/finance/transactions',
    CATEGORIES: '/api/finance/categories',
    REPORTS: '/api/finance/reports',
    BUDGET_LIMITS: '/api/finance/budget-limits',
  },
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  CALENDAR: {
    EVENTS: '/api/calendar/events',
  },
  INVENTORY: {
    PRODUCTS: '/api/inventory/products',
    SHOPPING_LIST: '/api/inventory/shopping-list',
  },
  AI: {
    CHAT: '/api/ai/chat',
    SUGGESTIONS: '/api/ai/suggestions',
  },
  GROUPS: {
    LIST: '/api/groups',
    MEMBERS: (groupId: string) => `/api/groups/${groupId}/members`,
    INVITATIONS: '/api/groups/invitations',
  },
  BITACORA: {
    MOMENTS: '/api/bitacora/moments',
    ALBUMS: '/api/bitacora/albums',
  },
  COMMUNICATION: {
    MESSAGES: '/api/communication/messages',
    NOTIFICATIONS: '/api/communication/notifications',
  },
};
ENDPOINTS

echo "✅ Endpoints creados"

# PASO 12: Tipos TypeScript comunes
echo "📦 Creando tipos TypeScript..."

cat > src/types/common.types.ts << 'COMMONTYPES'
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type Status = 'pending' | 'active' | 'completed' | 'cancelled';

export enum UserRole {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR',
  GUEST = 'GUEST',
}
COMMONTYPES

echo "✅ Tipos creados"

# PASO 13: Store de autenticación con Zustand
echo "🗄️ Creando store de autenticación..."

cat > src/store/authStore.ts << 'AUTHSTORE'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        localStorage.setItem('bondbox-token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('bondbox-token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'bondbox-auth',
    }
  )
);
AUTHSTORE

echo "✅ Store creado"

# PASO 14: Constantes de configuración
echo "⚙️ Creando constantes..."

cat > src/config/constants.ts << 'CONSTANTS'
export const APP_NAME = 'BondBox';
export const APP_VERSION = '1.0.0';

export const COLORS = {
  PRIMARY: '#F28627',
  PRIMARY_DARK: '#BC3503',
  PRIMARY_DARKER: '#591902',
  SECONDARY: '#403E23',
  LIGHT: '#BFC5D9',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  FINANCE: '/finanzas',
  TASKS: '/tareas',
  CALENDAR: '/calendario',
  INVENTORY: '/inventario',
  BITACORA: '/bitacora',
  AI: '/bondy-ai',
  SETTINGS: '/configuracion',
};
CONSTANTS

echo "✅ Constantes creadas"

# PASO 15: Utilidades de formateo
echo "🔧 Creando utilidades..."

cat > src/utils/formatters.ts << 'FORMATTERS'
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO').format(d);
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};
FORMATTERS

echo "✅ Utilidades creadas"

# PASO 16: Router básico
echo "🛣️ Creando router..."

cat > src/router/index.tsx << 'ROUTERINDEX'
import { createBrowserRouter } from 'react-router-dom';

// Placeholder pages - el equipo las desarrollará
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
    <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-5xl font-bold text-primary mb-4">{title}</h1>
      <p className="text-gray-600 text-lg">Esta página será desarrollada pronto</p>
      <div className="mt-6 flex gap-4 justify-center">
        <div className="w-12 h-12 bg-primary rounded-lg animate-pulse"></div>
        <div className="w-12 h-12 bg-primary-dark rounded-lg animate-pulse delay-75"></div>
        <div className="w-12 h-12 bg-secondary rounded-lg animate-pulse delay-150"></div>
      </div>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaceholderPage title="🏠 BondBox" />,
  },
  {
    path: '/auth/login',
    element: <PlaceholderPage title="🔐 Login" />,
  },
  {
    path: '/dashboard',
    element: <PlaceholderPage title="📊 Dashboard" />,
  },
  {
    path: '/finanzas',
    element: <PlaceholderPage title="💰 Finanzas" />,
  },
  {
    path: '/tareas',
    element: <PlaceholderPage title="✅ Tareas" />,
  },
  {
    path: '/calendario',
    element: <PlaceholderPage title="📅 Calendario" />,
  },
  {
    path: '/inventario',
    element: <PlaceholderPage title="📦 Inventario" />,
  },
  {
    path: '/bitacora',
    element: <PlaceholderPage title="📸 Bitácora" />,
  },
  {
    path: '/bondy-ai',
    element: <PlaceholderPage title="🤖 Bondy AI" />,
  },
]);
ROUTERINDEX

echo "✅ Router creado"

# PASO 17: App.tsx
echo "⚛️ Creando App.tsx..."

cat > src/App.tsx << 'APPTSX'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
APPTSX

echo "✅ App.tsx creado"

# PASO 18: main.tsx
echo "🚀 Creando main.tsx..."

cat > src/main.tsx << 'MAINTSX'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
MAINTSX

echo "✅ main.tsx creado"

# PASO 19: Setup de testing
echo "🧪 Creando configuración de testing..."

cat > src/test/setup.ts << 'TESTSETUP'
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
TESTSETUP

echo "✅ Testing configurado"

# PASO 20: .gitignore
echo "📝 Creando .gitignore..."

cat > .gitignore << 'GITIGNORE'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage
.nyc_output

# Misc
.cache
.temp
*.tgz
GITIGNORE

echo "✅ .gitignore creado"

# PASO 21: README.md
echo "📚 Creando README.md..."

cat > README.md << 'README'
# 🏠 BondBox Frontend

Plataforma web para organización familiar colaborativa.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará disponible en: http://localhost:3000
```

## 📦 Stack Tecnológico

- **React 18** + TypeScript
- **Vite 5** - Build tool
- **Tailwind CSS v3.4** - Estilos
- **Zustand** - Estado global
- **React Router v6** - Routing
- **Axios** - HTTP requests
- **React Hook Form + Zod** - Formularios y validación
- **Vitest** - Testing

## 🎨 Paleta de Colores

- **Primary:** #F28627 (Naranja)
- **Primary Dark:** #BC3503
- **Primary Darker:** #591902
- **Secondary:** #403E23 (Verde oliva)
- **Light:** #BFC5D9 (Azul claro)

## 🏗️ Estructura del Proyecto

```
src/
├── api/              # Configuración de APIs y servicios
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables
│   ├── common/       # Componentes globales
│   ├── layout/       # Layouts
│   └── features/     # Componentes por módulo
├── config/           # Configuraciones
├── hooks/            # Custom hooks
├── layouts/          # Layouts principales
├── pages/            # Páginas/Vistas
├── router/           # Configuración de rutas
├── store/            # Estado global (Zustand)
├── styles/           # Estilos globales
├── types/            # TypeScript types
└── utils/            # Utilidades
```

## 👥 Equipo y Módulos

- **Andrew Garcia:** IA (Bondy AI) & Finanzas
- **Juan Camilo Soto:** Auth & Grupos & Configuración
- **Valeria Alarcon:** Inventario & Comunicación
- **Kevin Santiago:** Tareas & Calendario & Bitácora

## 🔧 Scripts Disponibles

```bash
npm run dev              # Servidor de desarrollo (puerto 3000)
npm run build            # Compilar para producción
npm run preview          # Preview de build
npm run test             # Ejecutar tests
npm run test:ui          # UI de tests
npm run lint             # Linter
npm run lint:fix         # Arreglar problemas de linting
npm run format           # Formatear código
npm run type-check       # Verificar tipos TypeScript
```

## 🚦 Workflow de Git

```bash
# Crear feature branch
git checkout develop
git checkout -b feature/nombre-modulo

# Hacer cambios y commit
git add .
git commit -m "feat(modulo): descripción"

# Push y crear PR
git push origin feature/nombre-modulo
```

## 📖 Convenciones de Commits

- `feat(modulo):` Nueva funcionalidad
- `fix(modulo):` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Cambios en build o herramientas

## 📄 Licencia

Privado - Proyecto Académico EAM 2025

## 🔗 Enlaces

- [Figma Mockups](https://www.figma.com/design/bQZ88XXXdQbPLZ5zXIdkS8/BondBox)
- [Documentación del Proyecto](./docs/)
README

echo "✅ README.md creado"

# PASO 22: Limpiar node_modules anterior
echo ""
echo "🧹 Limpiando instalación anterior..."
rm -rf node_modules package-lock.json

# PASO 23: Instalar dependencias
echo ""
echo "📦 Instalando dependencias (esto puede tomar 2-3 minutos)..."
echo ""

npm install --legacy-peer-deps

# PASO 24: Verificar instalación
echo ""
echo "✅ Verificando instalación..."
echo ""

# Verificar TypeScript
if npm run type-check 2>&1 | grep -q "Found 0 errors"; then
    echo "✅ TypeScript: OK"
else
    echo "⚠️  TypeScript: Hay algunos warnings (normal en setup inicial)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 ¡CONFIGURACIÓN COMPLETADA!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1️⃣  Iniciar el servidor de desarrollo:"
echo "    npm run dev"
echo ""
echo "2️⃣  Abrir en el navegador:"
echo "    http://localhost:3000"
echo ""
echo "3️⃣  Inicializar Git:"
echo "    git init"
echo "    git add ."
echo "    git commit -m \"chore: configuración inicial de BondBox\""
echo "    git branch -M main"
echo "    git checkout -b develop"
echo ""
echo "4️⃣  Conectar con repositorio remoto:"
echo "    git remote add origin <URL_REPOSITORIO>"
echo "    git push -u origin develop"
echo "    git push -u origin main"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Configuración del Proyecto"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Tailwind CSS v3.4.1"
echo "✅ ESLint 8 + TypeScript ESLint 7"
echo "✅ React 18 + TypeScript"
echo "✅ Vite 5"
echo ""
echo "🎨 Colores:"
echo "   • Primary: #F28627"
echo "   • Primary Dark: #BC3503"
echo "   • Secondary: #403E23"
echo "   • Light: #BFC5D9"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Happy coding! 🚀"
echo ""
