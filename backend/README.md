# Backend - Konfex Web App

Backend API REST para el sistema de gestión de producción en industria textil, construido con Express.js, TypeScript, Prisma ORM y PostgreSQL.

## Tabla de Contenidos

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
- [Scripts Disponibles](#scripts-disponibles)

## Características

- API REST con Express.js 5
- Autenticación y autorización con JWT
- Validación de datos con Zod
- Documentación automática con Swagger/OpenAPI
- Logging estructurado con Pino
- Manejo centralizado de errores
- Arquitectura modular por features
- TypeScript para type safety completo
- ORM Prisma 7 para gestión de base de datos
- Integración con Telegram Bot para inbox
- Comunicación en tiempo real con Socket.io
- Gestión de archivos con Cloudinary
- Health check endpoint para monitoreo

## Tecnologías

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Lenguaje**: TypeScript 5.9.3
- **ORM**: Prisma 7.0.1
- **Base de Datos**: PostgreSQL 12+
- **Autenticación**: JWT (jsonwebtoken 9.0.2)
- **Validación**: Zod 4.1.12
- **Documentación**: Swagger (swagger-jsdoc 6.2.8, swagger-ui-express 5.0.1)
- **Logging**: Pino 10.1.0
- **Hashing**: bcrypt 6.0.0
- **Comunicación en Tiempo Real**: Socket.io 4.8.1
- **Gestión de Archivos**: Cloudinary 2.8.0

## Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

## Instalación

**Instalar dependencias:**

```bash
npm install
```

## Configuración

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

# Telegram (Opcional - necesario para inbox)
TELEGRAM_BOT_TOKEN="tu-telegram-bot-token"
TELEGRAM_SECRET_TOKEN="tu-secret-token"

# Cloudinary (Opcional - para gestión de archivos)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

### Ejemplo de `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/konfex_db?schema=public"
JWT_SECRET="mi-secret-super-seguro-12345"
PORT=3001
NODE_ENV=development
```

## Base de Datos

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

## Ejecución

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

## Estructura del Proyecto

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
│   │   ├── swagger.ts     # Configuración Swagger
│   │   ├── socket.ts      # Configuración Socket.io
│   │   └── cloudinary.ts  # Configuración Cloudinary
│   ├── middleware/        # Middlewares
│   │   ├── errorHandler.ts
│   │   └── validation.schema.ts
│   ├── modules/           # Módulos de la aplicación
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── cliente/       # Gestión de clientes
│   │   ├── categoria/     # Gestión de categorías de materiales
│   │   ├── colecciones/   # Gestión de colecciones
│   │   ├── gastos-negocio/# Configuración de gastos de negocio
│   │   ├── impuesto-general/ # Configuración de impuestos
│   │   ├── material/      # Gestión de materiales (CRUD completo con filtros avanzados)
│   │   ├── pedido/        # Gestión de pedidos
│   │   ├── presupuesto/   # Gestión de presupuestos
│   │   ├── producto/      # Gestión de productos
│   │   ├── telegram/      # Integración Telegram Bot
│   │   └── user/          # Gestión de usuarios
│   ├── types/             # Extensiones de tipos TypeScript
│   │   └── express.d.ts   # Extensiones para Express Request
│   ├── routes/            # Definición de rutas
│   ├── utils/             # Utilidades
│   │   ├── jwt.ts         # Utilidades JWT
│   │   ├── logger.ts      # Configuración de logger
│   │   └── uploadFile.ts  # Utilidades para carga de archivos
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

## API Endpoints

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

### Pedidos
- `GET /api/v1/pedidos` - Listar pedidos
- `GET /api/v1/pedidos/:id` - Obtener pedido por ID
- `POST /api/v1/pedidos` - Crear pedido (generalmente desde presupuesto aceptado)
- `PUT /api/v1/pedidos/:id` - Actualizar pedido
- `PATCH /api/v1/pedidos/:id/estado` - Actualizar estado del pedido

### Productos
- `GET /api/v1/productos` - Listar productos
- `GET /api/v1/productos/:id` - Obtener producto por ID
- `GET /api/v1/productos/search?q=query` - Buscar productos por nombre o descripción
- `POST /api/v1/productos` - Crear producto
- `PUT /api/v1/productos/:id` - Actualizar producto
- `DELETE /api/v1/productos/:id` - Eliminar producto

### Colecciones
- `GET /api/v1/colecciones` - Listar colecciones
- `GET /api/v1/colecciones/:id` - Obtener colección por ID
- `POST /api/v1/colecciones` - Crear colección
- `PUT /api/v1/colecciones/:id` - Actualizar colección
- `DELETE /api/v1/colecciones/:id` - Eliminar colección

### Materiales
- `GET /api/v1/materiales` - Listar materiales (con filtros, paginación y ordenamiento)
  - Filtros disponibles: `color`, `precioMin`, `precioMax`, `pesoMin`, `pesoMax`, `anchoMin`, `anchoMax`, `proveedor`, `search`
  - Paginación: `page`, `limit`
  - Ordenamiento: `sortBy`, `sortOrder`
- `GET /api/v1/materiales/:id` - Obtener material por ID
- `POST /api/v1/materiales` - Crear material
- `PUT /api/v1/materiales/:id` - Actualizar material
- `DELETE /api/v1/materiales/:id` - Eliminar material

### Categorías
- `GET /api/v1/categorias` - Listar categorías
- `GET /api/v1/categorias/:id` - Obtener categoría por ID
- `GET /api/v1/categorias/:id/materiales` - Obtener materiales de una categoría (con paginación: `page`, `limit`)
- `POST /api/v1/categorias` - Crear categoría
- `PUT /api/v1/categorias/:id` - Actualizar categoría
- `DELETE /api/v1/categorias/:id` - Eliminar categoría

### Gastos de Negocio
- `GET /api/v1/gastos-negocio` - Listar gastos de negocio
- `GET /api/v1/gastos-negocio/:id` - Obtener gasto de negocio por ID
- `POST /api/v1/gastos-negocio` - Crear gasto de negocio
- `PUT /api/v1/gastos-negocio/:id` - Actualizar gasto de negocio
- `DELETE /api/v1/gastos-negocio/:id` - Eliminar gasto de negocio

### Impuestos Generales
- `GET /api/v1/impuesto-general` - Obtener configuración de impuestos
- `POST /api/v1/impuesto-general` - Crear/actualizar configuración de impuestos
- `PUT /api/v1/impuesto-general/:id` - Actualizar impuesto

### Telegram / Inbox
- `POST /api/v1/telegram` - Webhook de Telegram para recibir mensajes
- `GET /api/v1/telegram/chats` - Listar conversaciones
- `GET /api/v1/telegram/chats/:chatId/messages` - Obtener mensajes de una conversación
- `GET /api/v1/telegram/chats/:chatId/cliente` - Obtener datos del cliente desde chat

### Utilidades
- `GET /api/v1/health` - Health check del servidor (incluye estado de base de datos)

## Documentación API

Una vez que el servidor esté corriendo, la documentación interactiva de Swagger estará disponible en:

**URL**: `http://localhost:3001/api/v1/docs`

Aquí podrás explorar todos los endpoints, sus parámetros, respuestas y probar la API directamente desde el navegador.

### Módulos Documentados
- **Autenticación** - Login, registro, refresh token
- **Productos** - CRUD completo con búsqueda
- **Materiales** - CRUD completo con filtros avanzados
- **Presupuestos** - Gestión completa de presupuestos
- **Pedidos** - Seguimiento de pedidos
- **Clientes** - Gestión de clientes
- **Telegram** - Integración con Telegram Bot

> **Nota**: La documentación se actualiza automáticamente al agregar comentarios JSDoc en los controladores. Consulta la interfaz Swagger para ver todos los endpoints documentados.

### Características de la Documentación
- Esquemas de request/response completos
- Ejemplos de uso para cada endpoint
- Parámetros de query documentados
- Códigos de respuesta y manejo de errores
- Interfaz interactiva para probar endpoints

## Scripts Disponibles

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
| `npm run lint:fix` | Ejecuta el linter y corrige errores automáticamente |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato del código |

## Seguridad

- Las contraseñas se hashean con bcrypt antes de almacenarse
- Los tokens JWT tienen tiempo de expiración configurado
- CORS está configurado para permitir solo orígenes autorizados
- Validación de datos de entrada con Zod
- Manejo centralizado de errores
- Validación de parámetros de ruta y query params
- Type safety completo con TypeScript
- Variables de entorno para información sensible
- Validación de webhooks de Telegram con secret token

## Integraciones

### Socket.io
El backend utiliza Socket.io para comunicación en tiempo real con el frontend. Los eventos incluyen:
- **telegram_message**: Notificación de nuevos mensajes de Telegram
- **konfex_send_message**: Envío de mensajes desde el frontend a Telegram

El servidor Socket.io se inicia automáticamente junto con el servidor HTTP y está configurado para aceptar conexiones desde el frontend en desarrollo y producción.

### Cloudinary
Integración con Cloudinary para gestión de archivos (imágenes y PDFs). Las credenciales se configuran mediante variables de entorno. Esta integración permite:
- Subida y almacenamiento de archivos
- Transformación de imágenes
- Gestión de recursos multimedia

### Telegram Bot
Integración completa con Telegram Bot API que permite:
- Recibir mensajes mediante webhook
- Enviar mensajes desde la aplicación
- Gestión de conversaciones y clientes
- Notificaciones en tiempo real

## Modelos de Datos Principales

### Usuarios (User)
- Autenticación y autorización
- Roles: USER, ADMIN
- Gestión de sesiones y lectura de mensajes

### Clientes (Cliente)
- Información de contacto (nombre, teléfono, email)
- Origen (Telegram, Instagram, Manual, etc.)
- Usuario de Instagram
- Notas adicionales
- Relación con presupuestos, pedidos y mensajes de Telegram

### Colecciones (Coleccion)
- Código único
- Nombre
- Imagen e icono
- Relación con productos

### Productos (Producto)
- Código único
- Nombre y descripción
- Tallas y colores disponibles
- Imagen
- Relación con colección
- Merma (cantidad, unidad, precio)
- Materiales y mano de obra asociados

### Categorías (Categoria)
- Nombre único
- Organización de materiales

### Materiales (Material)
- Nombre e imagen
- Categorización
- Unidad de medida
- Dimensiones (ancho, peso)
- Colores disponibles
- Proveedor y precio
- Filtrado avanzado por múltiples criterios
- Búsqueda por nombre
- Paginación y ordenamiento

### Presupuestos (Presupuesto)
- Número de presupuesto único
- Cliente asociado
- Fechas de creación y vencimiento
- Estados: BORRADOR, ENVIADO, ACEPTADO, RECHAZADO, VENCIDO
- Cálculo automático de costos, márgenes, ganancias e IVA
- Detalles por producto
- Adicionales (envíos, extras)
- Origen (Telegram o Manual)
- Relación con pedidos

### Pedidos (Pedido)
- Estados: NO_VISTO, EN_COMPRA, EN_PRODUCCION, ENTREGADO
- Relación con presupuesto (1:1)
- Fechas de creación, entrega estimada y real
- Estado de pago
- Detalles por producto (talla, color)
- Etapas de producción

### Gastos de Negocio (GastosNegocio)
- Nombre
- Porcentaje
- Usado en cálculos de presupuestos

### Impuestos Generales (ImpuestoGeneral)
- Nombre (generalmente IVA)
- Porcentaje
- Configuración global

### Telegram (TelegramMessage, MessageRead)
- Mensajes de Telegram almacenados
- Soporte para texto y archivos multimedia
- Metadatos de archivos (tipo, tamaño, URL)
- Sistema de lectura de mensajes por usuario
- Relación con clientes

## Licencia

Este proyecto está bajo la Licencia ISC.

