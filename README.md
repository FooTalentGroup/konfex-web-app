# Proyecto EOS Indumentaria (Konfex Web App)

Este repositorio contiene el código fuente para el sistema de gestión de EOS Indumentaria. El proyecto está organizado en un monorepo con carpetas separadas para el frontend y el backend, con el objetivo de optimizar la gestión de pedidos, cálculos de costos y presupuestos.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Configuración del Proyecto](#configuración-del-proyecto)
- [Ejecución Local](#ejecución-local)
- [Enlaces de Producción](#enlaces-de-producción)
- [Documentación Adicional](#documentación-adicional)
- [Contribución](#contribución)

## 📁 Estructura del Proyecto

```
konfex-web-app/
├── frontend/          # Frontend (Next.js, TypeScript, Tailwind CSS)
├── backend/           # Backend (Express.js, TypeScript, Prisma)
└── README.md          # Este archivo
```

### Descripción de Carpetas

- **`/frontend`**: Aplicación web construida con Next.js 16, React 19, TypeScript y Tailwind CSS. La estructura interna se organiza por features (auth, payment, employees, etc.) y carpetas comunes (common, lib, services).
- **`/backend`**: API REST construida con Express.js, TypeScript, Prisma ORM y PostgreSQL. Implementa una arquitectura modular con separación de responsabilidades.

## 🛠 Tecnologías

### Frontend
- **Framework**: Next.js 16
- **Lenguaje**: TypeScript
- **UI**: React 19, Tailwind CSS 4
- **Formularios**: React Hook Form + Zod
- **Estado**: Context API + Custom Hooks
- **Iconos**: Lucide React

### Backend
- **Framework**: Express.js 5
- **Lenguaje**: TypeScript
- **ORM**: Prisma 6
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación**: Swagger/OpenAPI
- **Logging**: Pino
- **Validación**: Zod

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **PostgreSQL** (para el backend)
- **Git**

## ⚙️ Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/FooTalentGroup/konfex-web-app.git
cd konfex-web-app
```

### 2. Configurar el Backend

Consulta el [README del Backend](./backend/README.md) para las instrucciones detalladas de configuración.

### 3. Configurar el Frontend

Consulta el [README del Frontend](./frontend/README.md) para las instrucciones detalladas de configuración.

## 🚀 Ejecución Local

### Opción 1: Ejecutar Todo el Proyecto

#### Backend

```bash
cd backend
npm install
npm run server
```

El backend estará disponible en: `http://localhost:3001`

#### Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Opción 2: Ejecutar Individualmente

Consulta los READMEs específicos de cada carpeta para más detalles sobre cómo ejecutar cada parte del proyecto de forma independiente.

## 🌐 Enlaces de Producción

- **Frontend (Vercel)**: [konfex-web-app.vercel.app](https://konfex-web-app.vercel.app)
- **Backend (Render/Railway)**: [PENDIENTE - AÑADIR ENLACE DEL BACKEND]

## 📚 Documentación Adicional

- [Documentación del Backend](./backend/README.md) - Guía completa del API y configuración
- [Documentación del Frontend](./frontend/README.md) - Guía completa de la aplicación web

### Detalles Técnicos

- **Dominio (Frontend)**: `https://konfex-web-app.vercel.app`
- **HTTPS (Frontend)**: Sí, gestionado automáticamente por Vercel
- **Puertos (Local)**: 
  - `3000` - Frontend
  - `3001` - Backend
- **Comandos Build**: 
  - Frontend: `npm run build` (se ejecuta automáticamente en Vercel)
  - Backend: `npm run build`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Equipo

Desarrollado por **equipo1-sp7** para **EOS Indumentaria**.

## 📞 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el [repositorio de GitHub](https://github.com/FooTalentGroup/konfex-web-app/issues).
