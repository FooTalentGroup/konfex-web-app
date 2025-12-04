# Backend - Konfex Web App

Backend API REST para el sistema de gestión de EOS Indumentaria, construido con Express.js, TypeScript, Prisma ORM y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Documentación API](#documentación-api)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)

## ✨ Características

- ✅ API REST con Express.js
- ✅ Autenticación y autorización con JWT
- ✅ Validación de datos con Zod
- ✅ Documentación automática con Swagger
- ✅ Logging estructurado con Pino
- ✅ Manejo centralizado de errores
- ✅ Arquitectura modular por features
- ✅ TypeScript para type safety
- ✅ ORM Prisma para gestión de base de datos
- ✅ Integración con Telegram Bot

## 🛠 Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Lenguaje**: TypeScript 5.9.3
- **ORM**: Prisma 7.0.1
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Validación**: Zod 4.1.12
- **Documentación**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Logging**: Pino 10.1.0
- **Hashing**: bcrypt 6.0.0
- **Testing**: Jest 30.2.0

## 📦 Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

## 🔧 Instalación

1. **Navegar a la carpeta del backend:**

```bash
cd backend
```

2. **Instalar dependencias:**

```bash
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `backend` con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/konfex_db?schema=public"

# JWT
JWT_SECRET="tu-secret-jwt-super-seguro"
JWT_REFRESH_SECRET="tu-refresh-secret-opcional"  # Opcional, si no se proporciona usa JWT_SECRET

# Servidor
PORT=3001
NODE_ENV=development  # development | production

# Telegram (Opcional)
TELEGRAM_BOT_TOKEN="tu-telegram-bot-token"
TELEGRAM_SECRET_TOKEN="tu-secret-token"
```

### Ejemplo de `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/konfex_db?schema=public"
JWT_SECRET="mi-secret-super-seguro-12345"
PORT=3001
NODE_ENV=development
```

## 🗄 Base de Datos

### 1. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y corriendo. Crea una base de datos:

```sql
CREATE DATABASE konfex_db;
```

### 2. Generar el Cliente de Prisma

```bash
npm run prisma:generate
```

### 3. Ejecutar Migraciones

```bash
npm run prisma:migrate
```

Este comando creará las tablas en tu base de datos según el esquema definido en `prisma/schema.prisma`.

### 4. (Opcional) Seed de Datos Iniciales

```bash
npm run seed
```

## 🚀 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001` (o el puerto especificado en `PORT`).

### Modo Producción

```bash
npm run build
npm start
```

O en un solo comando:

```bash
npm run start:prod
```

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   └── seed.ts            # Script para poblar datos iniciales
├── src/
│   ├── common/            # Utilidades y componentes comunes
│   │   ├── errors/        # Manejo de errores personalizados
│   │   ├── handlers/      # Handlers de controladores
│   │   ├── responses/     # Respuestas estandarizadas
│   │   └── types/         # Tipos compartidos
│   ├── config/            # Configuraciones
│   │   ├── cors.ts        # Configuración CORS
│   │   ├── prisma.ts      # Cliente de Prisma
│   │   └── swagger.ts     # Configuración Swagger
│   ├── middleware/        # Middlewares
│   │   ├── errorHandler.ts
│   │   └── validation.schema.ts
│   ├── modules/           # Módulos de la aplicación
│   │   ├── auth/          # Autenticación
│   │   ├── cliente/       # Gestión de clientes
│   │   ├── material/      # Gestión de materiales (CRUD completo con filtros avanzados)
│   │   ├── presupuesto/   # Gestión de presupuestos
│   │   ├── producto/      # Gestión de productos
│   │   ├── telegram/      # Integración Telegram
│   │   └── user/          # Gestión de usuarios
│   ├── types/             # Extensiones de tipos TypeScript
│   │   └── express.d.ts   # Extensiones para Express Request
│   ├── routes/            # Definición de rutas
│   ├── utils/             # Utilidades
│   │   ├── jwt.ts         # Utilidades JWT
│   │   └── logger.ts      # Configuración de logger
│   ├── app.ts             # Configuración de Express
│   └── index.ts           # Punto de entrada
├── tests/                 # Tests
│   └── unit/
│       └── auth/
├── .eslintrc.cjs          # Configuración ESLint
├── jest.config.ts         # Configuración Jest
├── tsconfig.json          # Configuración TypeScript
└── package.json
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrar usuario (si está habilitado)
- `POST /api/v1/auth/refresh` - Renovar token

### Clientes
- `GET /api/v1/clientes` - Listar clientes
- `GET /api/v1/clientes/:id` - Obtener cliente por ID
- `POST /api/v1/clientes` - Crear cliente
- `PUT /api/v1/clientes/:id` - Actualizar cliente
- `DELETE /api/v1/clientes/:id` - Eliminar cliente

### Presupuestos
- `GET /api/v1/presupuestos` - Listar presupuestos
- `GET /api/v1/presupuestos/:id` - Obtener presupuesto por ID
- `POST /api/v1/presupuestos` - Crear presupuesto
- `PUT /api/v1/presupuestos/:id` - Actualizar presupuesto
- `DELETE /api/v1/presupuestos/:id` - Eliminar presupuesto

### Materiales
- `GET /api/v1/materiales` - Listar materiales (con filtros, paginación y ordenamiento)
  - Filtros disponibles: `categoria`, `color`, `precioMin`, `precioMax`, `pesoMin`, `pesoMax`, `anchoMin`, `anchoMax`, `proveedor`, `search`
  - Paginación: `page`, `limit`
  - Ordenamiento: `sortBy`, `sortOrder`
- `GET /api/v1/materiales/:id` - Obtener material por ID
- `POST /api/v1/materiales` - Crear material
- `PUT /api/v1/materiales/:id` - Actualizar material
- `DELETE /api/v1/materiales/:id` - Eliminar material

### Productos
- `GET /api/v1/productos` - Listar productos
- `GET /api/v1/productos/:id` - Obtener producto por ID
- `POST /api/v1/productos` - Crear producto
- `PUT /api/v1/productos/:id` - Actualizar producto
- `DELETE /api/v1/productos/:id` - Eliminar producto

### Utilidades
- `GET /api/v1/health` - Health check del servidor
- `POST /api/v1/telegram` - Webhook de Telegram

## 📖 Documentación API

Una vez que el servidor esté corriendo, la documentación interactiva de Swagger estará disponible en:

**URL**: `http://localhost:3001/api/v1/docs`

Aquí podrás explorar todos los endpoints, sus parámetros, respuestas y probar la API directamente desde el navegador.

### Módulos Documentados
- ✅ **Autenticación** - Login, registro, refresh token
- ✅ **Productos** - CRUD completo con documentación
- ✅ **Materiales** - CRUD completo con filtros avanzados y documentación detallada

### Características de la Documentación
- Esquemas de request/response completos
- Ejemplos de uso para cada endpoint
- Parámetros de query documentados
- Códigos de respuesta y manejo de errores
- Interfaz interactiva para probar endpoints

## 🧪 Testing

### Ejecutar Tests

```bash
npm test
```

### Ejecutar Tests en Modo Watch

```bash
npm test -- --watch
```

### Estructura de Tests

Los tests se encuentran en la carpeta `tests/` y están organizados por módulos. Actualmente hay tests unitarios para el módulo de autenticación.

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run server` | Inicia el servidor en modo desarrollo con hot reload |
| `npm run build` | Compila el proyecto TypeScript a JavaScript |
| `npm start` | Inicia el servidor en modo producción |
| `npm run start:prod` | Construye y ejecuta el servidor en producción |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Ejecuta las migraciones de la base de datos |
| `npm run seed` | Pobla la base de datos con datos iniciales |
| `npm run lint` | Ejecuta el linter ESLint |
| `npm test` | Ejecuta los tests con Jest |

## 🔒 Seguridad

- Las contraseñas se hashean con bcrypt antes de almacenarse
- Los tokens JWT tienen tiempo de expiración configurado
- CORS está configurado para permitir solo orígenes autorizados
- Validación de datos de entrada con Zod
- Manejo centralizado de errores
- Validación de parámetros de ruta y query params
- Type safety completo con TypeScript

## 📝 Modelos de Datos Principales

### Usuarios
- Autenticación y autorización
- Roles: USER, ADMIN

### Clientes
- Información de contacto
- Relación con presupuestos y pedidos

### Productos
- Definición de productos con tallas y colores
- Materiales y mano de obra asociados

### Presupuestos
- Estados: BORRADOR, ENVIADO, ACEPTADO, RECHAZADO, VENCIDO
- Cálculo de costos y márgenes
- Detalles por producto

### Pedidos
- Estados: PENDIENTE, EN_PRODUCCION, LISTO, ENTREGADO, CANCELADO
- Seguimiento de producción
- Relación con presupuestos

### Materiales
- Control de stock y inventario
- Costos unitarios y precios
- Categorización (Tela, Hilo, Accesorio, etc.)
- Gestión de colores disponibles
- Información de proveedores
- Filtrado avanzado por múltiples criterios
- Búsqueda por nombre
- Paginación y ordenamiento
- Documentación completa en Swagger

## 🐛 Troubleshooting

### Error de conexión a la base de datos

- Verifica que PostgreSQL esté corriendo
- Confirma que la `DATABASE_URL` en `.env` sea correcta
- Asegúrate de que la base de datos exista

### Error de migraciones

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Puerto ya en uso

Cambia el puerto en el archivo `.env` o detén el proceso que está usando el puerto 3001.

## 📞 Soporte

Para reportar bugs o solicitar features relacionadas con el backend, por favor abre un issue en el [repositorio de GitHub](https://github.com/FooTalentGroup/konfex-web-app/issues).

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

