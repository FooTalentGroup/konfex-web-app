# Proyecto EOS Indumentaria (Konfex Web App)

Este repositorio contiene el código fuente para el sistema de gestión de EOS Indumentaria. El proyecto está organizado en un monorepo con carpetas separadas para el frontend y el backend, con el objetivo de optimizar la gestión de pedidos, cálculos de costos, presupuestos y comunicación con clientes a través de Telegram.

## Tabla de Contenidos

- [Proyecto EOS Indumentaria (Konfex Web App)](#proyecto-eos-indumentaria-konfex-web-app)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Estructura del Proyecto](#estructura-del-proyecto)
    - [Descripción de Carpetas](#descripción-de-carpetas)
  - [Características Principales](#características-principales)
    - [Gestión de Negocio](#gestión-de-negocio)
    - [Comunicación](#comunicación)
    - [Configuración](#configuración)
  - [🛠 Tecnologías](#-tecnologías)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Prerrequisitos](#prerrequisitos)
  - [Configuración del Proyecto](#configuración-del-proyecto)
    - [1. Clonar el Repositorio](#1-clonar-el-repositorio)
    - [2. Configurar el Backend](#2-configurar-el-backend)
    - [3. Configurar el Frontend](#3-configurar-el-frontend)
  - [Ejecución Local](#ejecución-local)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
    - [Nota Importante](#nota-importante)
  - [Enlaces de Producción](#enlaces-de-producción)
  - [Documentación Adicional](#documentación-adicional)
    - [Detalles Técnicos](#detalles-técnicos)
  - [Licencia](#licencia)
  - [Equipo](#equipo)
  - [Soporte](#soporte)

## Estructura del Proyecto

```
konfex-web-app/
├── frontend/          # Frontend (Next.js, TypeScript, Tailwind CSS)
├── backend/           # Backend (Express.js, TypeScript, Prisma)
├── vercel.json        # Configuración de Vercel para frontend
└── README.md          # Este archivo
```

### Descripción de Carpetas

- **`/frontend`**: Aplicación web construida con Next.js 16, React 19, TypeScript y Tailwind CSS. La estructura interna se organiza por features (auth, presupuestos, pedidos, inbox, etc.) y carpetas comunes (common, hooks, services). Incluye integración con Socket.io para mensajería en tiempo real y Cloudinary para gestión de archivos.

- **`/backend`**: API REST construida con Express.js 5, TypeScript, Prisma ORM y PostgreSQL. Implementa una arquitectura modular con separación de responsabilidades. Incluye integración con Telegram Bot, Socket.io para comunicación en tiempo real, Cloudinary para gestión de archivos y documentación automática con Swagger.

## Características Principales

### Gestión de Negocio
- **Presupuestos**: Creación, gestión y seguimiento de presupuestos con cálculo automático de costos, márgenes y IVA
- **Pedidos**: Seguimiento completo del ciclo de vida de pedidos desde creación hasta entrega
- **Clientes**: Base de datos completa de clientes con historial de interacciones
- **Productos y Colecciones**: Gestión de productos organizados en colecciones con tallas, colores y materiales
- **Materia Prima**: Control de inventario de materiales (telas, hilos, accesorios) con categorización
- **Calculadora de Costos**: Herramienta para calcular costos de producción considerando materiales y mano de obra

### Comunicación
- **Inbox Integrado**: Sistema de mensajería integrado con Telegram para comunicación con clientes
- **Notificaciones en Tiempo Real**: Comunicación bidireccional usando Socket.io
- **Multiplataforma**: Soporte para conversaciones desde Telegram

### Configuración
- **Gastos de Negocio**: Configuración de porcentajes de gastos generales
- **Categorías**: Organización de materiales por categorías
- **Impuestos**: Configuración de impuestos generales (IVA)

## 🛠 Tecnologías

### Frontend
- **Framework**: Next.js 16.0.3
- **Librería UI**: React 19.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form 7.66.1 + Zod 4.1.12
- **Estado**: Context API + Custom Hooks
- **Iconos**: Lucide React 0.554.0
- **Comunicación en Tiempo Real**: Socket.io-client 4.8.1
- **Gestión de Archivos**: Integración con Cloudinary

### Backend
- **Framework**: Express.js 5.1.0
- **Lenguaje**: TypeScript 5.9.3
- **ORM**: Prisma 7.0.1
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Documentación**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Logging**: Pino 10.1.0
- **Validación**: Zod 4.1.12
- **Comunicación en Tiempo Real**: Socket.io 4.8.1
- **Gestión de Archivos**: Cloudinary 2.8.0
- **Hashing**: bcrypt 6.0.0
- **Integración**: Telegram Bot API

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**
- Algún instalador de paquetes como **npm**
- **PostgreSQL**
- **Git**
- **Cuenta de Cloudinary** (para gestión de imágenes y PDFs)
- **Bot de Telegram** (opcional, para funcionalidad de inbox)

## Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/FooTalentGroup/konfex-web-app.git
cd konfex-web-app
```

### 2. Configurar el Backend

Consulta el [README del Backend](./backend/README.md) para las instrucciones detalladas de configuración.

**Configuración rápida:**
```bash
cd backend
npm install
# Crear archivo .env con las variables necesarias
npm run prisma:generate
npm run prisma:migrate
npm run seed  # Opcional: poblar base de datos con datos iniciales
```

### 3. Configurar el Frontend

Consulta el [README del Frontend](./frontend/README.md) para las instrucciones detalladas de configuración.

**Configuración rápida:**
```bash
cd frontend
npm install
# Crear archivo .env.local con NEXT_PUBLIC_API_URL
```

## Ejecución Local

#### Backend

```bash
cd backend
npm install
npm run server
```

El backend estará disponible en: `http://localhost:3001`
- API: `http://localhost:3001/api/v1`
- Documentación Swagger: `http://localhost:3001/api/v1/docs`
- Health Check: `http://localhost:3001/api/v1/health`

#### Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Nota Importante

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- El frontend necesita la variable de entorno `NEXT_PUBLIC_API_URL` apuntando al backend
- Para funcionalidad completa del inbox, configura las variables de Telegram en el backend

## Enlaces de Producción

- **Frontend (Vercel)**: [konfex-web-app.vercel.app](https://konfex-web-app.vercel.app)
- **Backend**: Consultar configuración de deployment en [README del Backend](./backend/README.md)

> **Nota**: El backend debe estar desplegado y configurado con las variables de entorno necesarias para que el frontend funcione correctamente.

## Documentación Adicional

- [Documentación del Backend](./backend/README.md) - Guía completa del API y configuración
- [Documentación del Frontend](./frontend/README.md) - Guía completa de la aplicación web

### Detalles Técnicos

- **Dominio (Frontend)**: `https://konfex-web-app.vercel.app`
- **HTTPS (Frontend)**: Sí, gestionado automáticamente por Vercel
- **Puertos (Local)**: 
  - `3000` - Frontend (Next.js)
  - `3001` - Backend (Express.js)
- **Comandos Build**: 
  - Frontend: `npm run build` (se ejecuta automáticamente en Vercel)
  - Backend: `npm run build` (compila TypeScript y genera cliente Prisma)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma 7.0.1
- **Comunicación**: REST API + WebSocket (Socket.io)

## Licencia

Este proyecto está bajo la Licencia ISC.

## Equipo

Desarrollado por **equipo1-sp7** para practicas de **FooTalent Group**.
Agradecimiento especial a **EOS Indumentaria** por prestarse como modelo de practicas para el desarrollo de las soluciones.

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el [repositorio de GitHub](https://github.com/FooTalentGroup/konfex-web-app/issues).
