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

- [Figma Mockups](https://www.figma.com/design/bQZ88XXXdQbPLZ5zXIdkS8/BondBox-ProyectoFinal-ElectivaBackend?node-id=103-14901&t=Z1IvupTI2Gg9zJpT-1)
- [Documentación del Proyecto](https://docs.google.com/document/d/1I_q6LsJvKukgbA7kEg_UfmwTjA95k-0pterWRS--64Y/edit?usp=sharing)
