# Proyecto Konfex Web App

Este repositorio contiene el código fuente para el sistema de gestión de EOS Indumentaria. El proyecto está organizado en un monorepo con carpetas separadas para el frontend y el backend, con el objetivo de optimizar la gestión de pedidos, cálculos de costos, presupuestos y comunicación con clientes a través de Telegram.

## Tabla de Contenidos

- [Proyecto Konfex Web App](#proyecto-konfex-web-app)
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
- [Configuración de Autenticación JWT](#configuración-de-autenticación-jwt)
  - [Descripción General](#descripción-general)
  - [Componentes Principales](#componentes-principales)
    - [1. Middleware de Next.js (`src/middleware.ts`)](#1-middleware-de-nextjs-srcmiddlewarets)
    - [2. Utilidades de Token (`src/utils/token.utils.ts`)](#2-utilidades-de-token-srcutilstokenutilsts)
    - [3. Componente de Protección (`src/components/common/ProtectedRoute.tsx`)](#3-componente-de-protección-srccomponentscommonprotectedroutetsx)
    - [4. Hooks de Autenticación](#4-hooks-de-autenticación)
      - [`useAuth`](#useauth)
      - [`useLogin`](#uselogin)
    - [5. Servicio de Autenticación (`src/services/auth.service.ts`)](#5-servicio-de-autenticación-srcservicesauthservicets)
  - [Flujo de Autenticación](#flujo-de-autenticación)
    - [Login](#login)
    - [Acceso a Rutas Protegidas](#acceso-a-rutas-protegidas)
    - [Logout](#logout)
  - [Almacenamiento de Tokens](#almacenamiento-de-tokens)
  - [Seguridad](#seguridad)
    - [Validación del Token](#validación-del-token)
    - [Protección de Rutas](#protección-de-rutas)
    - [Cookies Seguras](#cookies-seguras)
  - [Configuración](#configuración-1)
    - [Variables de Entorno](#variables-de-entorno)
    - [Rutas Públicas](#rutas-públicas)
  - [Uso en Componentes](#uso-en-componentes)
    - [Proteger una Página](#proteger-una-página)
    - [Obtener Datos del Usuario](#obtener-datos-del-usuario)
    - [Verificar Autenticación](#verificar-autenticación)
  - [Troubleshooting](#troubleshooting)
    - [El usuario puede acceder sin login](#el-usuario-puede-acceder-sin-login)
    - [Redirección infinita](#redirección-infinita)
    - [Token no se guarda](#token-no-se-guarda)
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
- **Framework**: Next.js 16.0.7
- **Librería UI**: React 18.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form 7.66.1 + Zod 4.1.12
- **Estado**: Context API + Custom Hooks
- **Iconos**: Lucide React 0.554.0
- **Comunicación en Tiempo Real**: Socket.io-client 4.8.1
- **Gestión de Archivos**: Integración con Cloudinary
- **Generación de PDFs**: React PDF Renderer 4.3.1
- **Emojis**: Emoji Mart 5.6.0
- **Zoom de Imágenes**: React Medium Image Zoom 5.4.0

### Backend
- **Framework**: Express.js 5.1.0
- **Lenguaje**: TypeScript 5.9.3
- **ORM**: Prisma 7.0.1 con Prisma Adapter PG
- **Base de Datos**: PostgreSQL 12+
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Documentación**: Swagger (swagger-jsdoc 6.2.8, swagger-ui-express 5.0.1)
- **Logging**: Pino 10.1.0 con Pino HTTP 11.0.0
- **Validación**: Zod 4.1.12
- **Comunicación en Tiempo Real**: Socket.io 4.8.1
- **Gestión de Archivos**: Cloudinary 2.8.0
- **Hashing**: bcrypt 6.0.0
- **Integración**: Telegram Bot API con Axios 1.13.2

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

- **Frontend (Railway)**: [https://surprising-wholeness-production.up.railway.app/](https://surprising-wholeness-production.up.railway.app/)
- **Backend**: Consultar configuración de deployment en [https://konfex-web-app-production.up.railway.app/api/v1/docs/](https://konfex-web-app-production.up.railway.app/api/v1/docs/)

> **Nota**: El backend debe estar desplegado y configurado con las variables de entorno necesarias para que el frontend funcione correctamente.

## Documentación Adicional

- [Documentación del Backend](./backend/README.md) - Guía completa del API y configuración
- [Documentación del Frontend](./frontend/README.md) - Guía completa de la aplicación web

### Detalles Técnicos

- **Dominio (Frontend)**: `https://surprising-wholeness-production.up.railway.app/`
- **HTTPS (Frontend)**: Sí, gestionado automáticamente por Railway
- **Puertos (Local)**: 
  - `3000` - Frontend (Next.js)
  - `3001` - Backend (Express.js)
- **Comandos Build**: 
  - Frontend: `npm run build` (se ejecuta automáticamente en Railway)
  - Backend: `npm run build` (compila TypeScript y genera cliente Prisma)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma 7.0.1
- **Comunicación**: REST API + WebSocket (Socket.io)

# Configuración de Autenticación JWT

## Descripción General

Este documento describe la implementación de autenticación JWT en la aplicación KONFEX. El sistema protege todas las rutas excepto la página de login, requiriendo que los usuarios inicien sesión antes de acceder a cualquier funcionalidad.

## Componentes Principales

### 1. Middleware de Next.js (`src/middleware.ts`)

El middleware intercepta todas las peticiones y verifica la autenticación antes de permitir el acceso:

- **Rutas públicas**: Solo `/` (página de login) es accesible sin autenticación
- **Verificación de token**: Comprueba la presencia y validez del token JWT
- **Redirección automática**: Redirige a login si no hay token válido
- **Preservación de ruta**: Guarda la ruta original en query params para redirigir después del login

### 2. Utilidades de Token (`src/utils/token.utils.ts`)

Funciones centralizadas para manejar tokens JWT:

- `decodeToken(token)`: Decodifica el payload del JWT
- `isTokenExpired(token)`: Verifica si el token ha expirado
- `getTokenExpirationTime(token)`: Obtiene el tiempo restante de validez
- `saveToken(token)`: Guarda el token en localStorage y cookies
- `saveRefreshToken(refreshToken)`: Guarda el refresh token
- `getToken()`: Obtiene el token de localStorage
- `getRefreshToken()`: Obtiene el refresh token
- `clearTokens()`: Limpia todos los tokens (localStorage y cookies)
- `isAuthenticated()`: Verifica si el usuario está autenticado

### 3. Componente de Protección (`src/components/common/ProtectedRoute.tsx`)

Componente React que proporciona una capa adicional de protección:

```tsx
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

- Verifica autenticación en el cliente
- Muestra loading mientras verifica
- Redirige a login si no está autenticado

### 4. Hooks de Autenticación

#### `useAuth`
- Maneja el estado del usuario
- Proporciona función de logout
- Sincroniza el estado entre pestañas

#### `useLogin`
- Maneja el formulario de login
- Guarda tokens después del login exitoso
- Redirige a la ruta original o a inbox

### 5. Servicio de Autenticación (`src/services/auth.service.ts`)

Maneja las peticiones al backend:

- `signIn(credentials)`: Inicia sesión
- `signUp(credentials)`: Registra nuevo usuario
- `signOut()`: Cierra sesión y limpia tokens

## Flujo de Autenticación

### Login
1. Usuario ingresa credenciales en `/`
2. `useLogin` envía petición al backend
3. Backend responde con token, refreshToken y datos del usuario
4. Tokens se guardan usando `saveToken()` y `saveRefreshToken()`
5. Usuario se redirige a la ruta original o a `/inbox`

### Acceso a Rutas Protegidas
1. Usuario intenta acceder a una ruta protegida (ej: `/inbox`)
2. Middleware verifica el token
3. Si el token es válido, permite el acceso
4. Si no hay token o es inválido, redirige a `/?redirect=/inbox`

### Logout
1. Usuario hace click en logout
2. `useAuth.logout()` llama a `authService.signOut()`
3. `authService.signOut()` limpia tokens usando `clearTokens()`
4. Usuario es redirigido a `/`

## Almacenamiento de Tokens

Los tokens se almacenan en dos lugares:

1. **localStorage**: Para persistencia entre sesiones
   - `token`: JWT de acceso
   - `refreshToken`: Token para renovar el JWT
   - `user`: Datos del usuario

2. **Cookies**: Para que el middleware pueda acceder
   - `token`: JWT de acceso con fecha de expiración

## Seguridad

### Validación del Token
- El middleware verifica la expiración del token antes de permitir el acceso
- Los tokens expirados son rechazados automáticamente
- La verificación se hace decodificando el payload (campo `exp`)

### Protección de Rutas
- **Nivel 1**: Middleware de Next.js (server-side)
- **Nivel 2**: Componente ProtectedRoute (client-side)
- **Nivel 3**: Hooks de autenticación (estado de la aplicación)

### Cookies Seguras
- `SameSite=Strict`: Previene ataques CSRF
- `path=/`: Disponible en toda la aplicación
- Fecha de expiración sincronizada con el token

## Configuración

### Variables de Entorno
Asegúrate de tener configurada la URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Rutas Públicas
Para agregar más rutas públicas, edita el array en `src/middleware.ts`:

```typescript
const publicRoutes = ['/', '/public-route'];
```

## Uso en Componentes

### Proteger una Página
```tsx
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Contenido protegido</div>
    </ProtectedRoute>
  );
}
```

### Obtener Datos del Usuario
```tsx
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Hola, {user?.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### Verificar Autenticación
```tsx
import { isAuthenticated } from '@/utils/token.utils';

if (isAuthenticated()) {
  // Usuario autenticado
}
```

## Troubleshooting

### El usuario puede acceder sin login
- Verifica que el middleware esté en `src/middleware.ts`
- Revisa que las rutas estén en el `matcher` del middleware
- Comprueba que los tokens se estén guardando correctamente

### Redirección infinita
- Verifica que `/` esté en `publicRoutes`
- Comprueba que el token no esté expirado
- Revisa la consola del navegador para errores

### Token no se guarda
- Verifica que `saveToken()` se esté llamando después del login
- Comprueba que localStorage esté habilitado en el navegador
- Revisa que las cookies no estén bloqueadas

## Licencia

Este proyecto está bajo la Licencia ISC.

## Equipo

Desarrollado por **equipo1-sp7** para practicas de **FooTalent Group**.
Agradecimiento especial a **EOS Indumentaria** por prestarse como modelo de practicas para el desarrollo de las soluciones.

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el [repositorio de GitHub](https://github.com/FooTalentGroup/konfex-web-app/issues).
