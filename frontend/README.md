# Frontend - Konfex Web App

Aplicación web frontend para el sistema de gestión de producción en industria textil, construida con Next.js 16, React 19, TypeScript y Tailwind CSS.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Features Principales](#features-principales)
- [Componentes](#componentes)
- [Hooks Personalizados](#hooks-personalizados)
- [Scripts Disponibles](#scripts-disponibles)
- [Deployment](#deployment)

## Características

- Framework Next.js con App Router
- React con Server Components y Client Components
- TypeScript para type safety completo
- Tailwind CSS para estilos modernos
- Formularios con React Hook Form + Zod
- Autenticación con JWT
- Manejo de estado con Context API
- Hooks personalizados para lógica reutilizable
- Diseño responsive y mobile-first
- Integración con Cloudinary para imágenes y PDFs
- Comunicación en tiempo real con Socket.io
- Sistema de notificaciones con Toast
- Navegación con Sidebar y Header

## 🛠 Tecnologías

- **Framework**: Next.js 16.0.7
- **Librería UI**: React 18.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form 7.66.1 + Zod 4.1.12
- **Iconos**: Lucide React 0.554.0 + Heroicons 2.2.0
- **Comunicación en Tiempo Real**: Socket.io-client 4.8.1
- **Generación de PDFs**: React PDF Renderer 4.3.1
- **Emojis**: Emoji Mart 5.6.0
- **Zoom de Imágenes**: React Medium Image Zoom 5.4.0
- **Build Tool**: Next.js (Turbopack)

## Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend API corriendo (ver [README del Backend](../backend/README.md))

## Instalación

**Instalar dependencias:**

```bash
npm install
```

## Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz de la carpeta `frontend` con las siguientes variables:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Ejemplo de `.env.local`

Para desarrollo local:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Para producción:
```env
NEXT_PUBLIC_API_URL=https://tu-backend-production.com/api/v1
```

> **Nota**: La URL debe incluir `/api/v1` al final ya que el frontend hace peticiones a los endpoints con ese prefijo.

## Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Modo Producción

```bash
npm run build
npm start
```

El build optimizado estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos (imágenes, iconos, logos)
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── calculator/    # Página de calculadora de costos
│   │   ├── colecciones/   # Gestión de colecciones
│   │   │   └── verano/    # Colección específica con crear prenda
│   │   ├── inbox/         # Sistema de inbox/mensajería
│   │   │   └── chat/      # Página de chat individual
│   │   │       └── [id]/  # Chat dinámico por ID
│   │   ├── materia-prima/ # Gestión de materia prima
│   │   │   └── tela/      # Gestión específica de telas
│   │   │       └── crear-tela/  # Formulario para crear tela
│   │   ├── pedidos/       # Página de gestión de pedidos
│   │   ├── presupuestos/  # Gestión de presupuestos
│   │   │   └── [id]/      # Vista detallada de presupuesto
│   │   ├── fonts/         # Fuentes personalizadas
│   │   ├── styles/        # Estilos globales
│   │   │   └── globals.css
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Página home (login)
│   │   └── icon.svg       # Icono de la aplicación
│   ├── components/        # Componentes React
│   │   ├── calculator/    # Componentes de calculadora
│   │   ├── common/        # Componentes comunes reutilizables
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── inbox/         # Componentes específicos de inbox
│   │   ├── orders/        # Componentes de pedidos
│   │   ├── presupuestos/  # Componentes de presupuestos
│   │   ├── providers/     # Context Providers
│   │   └── ui/            # Componentes UI especializados
│   ├── config/            # Configuraciones
│   │   ├── api.config.ts  # Configuración de API
│   │   ├── apiClient.ts   # Cliente HTTP con interceptores
│   │   └── socket.config.ts  # Configuración de Socket.io
│   ├── contexts/          # Context API
│   │   ├── ToastContext.tsx
│   │   └── UnsavedChangesContext.tsx  # Gestión de cambios no guardados
│   ├── hooks/             # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useBudgets.ts
│   │   ├── useBudgetCalculator.ts
│   │   ├── useClients.ts
│   │   ├── useMaterials.ts
│   │   ├── useChat.ts
│   │   ├── useSocket.ts
│   │   └── ...
│   ├── services/          # Servicios de API
│   │   ├── auth.service.ts
│   │   ├── cliente.service.ts
│   │   ├── presupuesto.service.ts
│   │   ├── pedido.service.ts
│   │   ├── material.service.ts
│   │   ├── garment.service.ts
│   │   ├── cloudinaryImg.service.ts
│   │   ├── cloudinaryPDF.service.ts
│   │   └── socket.service.ts
│   ├── types/             # Definiciones TypeScript
│   │   ├── auth.types.ts
│   │   ├── IBudget.ts
│   │   ├── IFabric.ts
│   │   ├── IGarment.ts
│   │   └── presupuesto.types.ts
│   └── utils/             # Utilidades
│       ├── dateUtils.ts
│       ├── presupuestoLoader.ts
│       └── presupuestoMapper.ts
├── next.config.ts         # Configuración de Next.js
├── postcss.config.mjs     # Configuración de PostCSS
├── tsconfig.json          # Configuración TypeScript
└── package.json
```

## Features Principales

### 1. **Home / Login**
- Página de inicio con formulario de login
- Autenticación con JWT
- Redirección automática si ya está autenticado
- Manejo de sesión y estado de autenticación

### 2. **Autenticación**
- Login con JWT
- Manejo de sesión persistente
- Protección de rutas
- Context API para estado global de usuario

### 3. **Presupuestos**
- Listado de presupuestos con filtros
- Creación de presupuestos desde cero
- Vista detallada de presupuesto
- Cálculo automático de costos, márgenes e IVA
- Exportación a PDF
- Estados: Borrador, Enviado, Aceptado, Rechazado, Vencido
- Relación con clientes y productos

### 4. **Calculadora**
- Cálculo detallado de costos de productos
- Selección de prendas y colecciones
- Consideración de materiales y mano de obra
- Configuración de márgenes de ganancia
- Resumen de costos y precios

### 5. **Clientes**
- Gestión completa de base de clientes
- Información de contacto (nombre, teléfono, email)
- Origen del cliente (Telegram, Instagram, Manual)
- Historial de presupuestos y pedidos asociados

### 6. **Materia Prima**
- Listado de materiales con filtros avanzados
- Gestión de categorías
- Control específico de telas
- Formulario para crear nuevos materiales
- Visualización de imágenes y detalles

### 7. **Pedidos**
- Listado de todos los pedidos
- Seguimiento de estados: No visto, En compra, En producción, Entregado
- Información de cliente y presupuesto asociado
- Fechas de entrega estimadas y reales
- Filtros y búsqueda

### 8. **Inbox / Mensajería**
- Sistema de mensajería integrado con Telegram
- Listado de conversaciones con filtros por plataforma
- Chat individual por conversación
- Comunicación en tiempo real con Socket.io
- Envío y recepción de mensajes
- Información del cliente asociado al chat

### 9. **Colecciones**
- Visualización de colecciones
- Navegación a colecciones específicas
- Creación de prendas dentro de colecciones
- Gestión de productos por colección

## Componentes

### Componentes Comunes (`components/common/`)

- **Header**: Encabezado principal con menú hamburguesa y usuario
- **Sidebar**: Menú lateral deslizable con navegación
- **Footer**: Pie de página
- **Button**: Botón reutilizable con variantes de estilo
- **Input**: Input de formulario estilizado
- **Toast**: Sistema de notificaciones toast
- **SearchBar**: Barra de búsqueda reutilizable
- **SearchBarWhite**: Variante blanca de barra de búsqueda
- **BudgetCard**: Tarjeta de presupuesto con información resumida
- **MaterialCard**: Tarjeta de material con detalles
- **PageHeader**: Encabezado de página con título y acciones
- **BackNavigationBar**: Navegación hacia atrás
- **DatePicker**: Selector de fechas
- **UserMenu**: Menú de usuario con opciones
- **CollectionCard**: Tarjeta de colección
- **CategoryButton**: Botón de categoría
- **CollectionButton**: Botón de colección
- **AddFloatingButton**: Botón flotante para agregar
- **CircularAddButton**: Botón circular para agregar
- **FabricForm**: Formulario de tela/material
- **GarmentForm**: Formulario de prenda
- **AddGarmentTemplate**: Template para agregar prenda
- **CreateFabricTemplate**: Template para crear tela

### Componentes de Inbox (`components/inbox/`)

- **ChatList**: Lista de conversaciones
- **ChatItem**: Item individual de conversación
- **ChatHeader**: Encabezado del chat
- **ChatMessages**: Contenedor de mensajes
- **ChatMessage**: Mensaje individual
- **ChatInput**: Input para escribir mensajes
- **FilterButtons**: Botones de filtro por plataforma
- **InboxHeader**: Encabezado de la página de inbox

### Componentes de Calculadora (`components/calculator/`)

- **CalculatorTemplate**: Template principal de calculadora
- **CalculatorTabs**: Pestañas de la calculadora
- **GarmentAutocomplete**: Autocompletado de prendas
- **BudgetSummaryHeader**: Encabezado de resumen
- **BudgetTotalBadge**: Badge con total
- **BudgetPDF**: Generación de PDF de presupuesto
- **UnsavedChangesModal**: Modal de confirmación para cambios no guardados
- **Steps**: Componentes para los pasos del cálculo

### Componentes UI (`components/ui/`)

- **BudgetForm**: Formulario completo de presupuesto
- **CostSectionCard**: Tarjeta de sección de costos
- **PriceSummaryCard**: Resumen de precios
- **CustomInput**: Input personalizado con validación
- **CustomSelect**: Select personalizado
- **ImageUploadField**: Campo de carga de imágenes a Cloudinary
- **UploadPDFModal**: Modal para subir PDFs
- **NavigationTabs**: Pestañas de navegación

### Componentes de Pedidos (`components/orders/`)

- **OrderCard**: Tarjeta de pedido con estado e información

## Hooks Personalizados

### Autenticación y Navegación
- **`useAuth`**: Manejo de autenticación, sesión y usuario actual
- **`useLogin`**: Lógica completa de login con validación
- **`useSidebar`**: Estado y control del sidebar (abrir/cerrar)

### Gestión de Datos
- **`useBudgets`**: CRUD completo de presupuestos
- **`useBudgetCalculator`**: Cálculos detallados de presupuesto
- **`useBudgetMetadata`**: Metadatos de presupuesto
- **`useBudgetExport`**: Exportación de presupuestos a PDF
- **`useClients`**: Gestión de clientes
- **`useMaterials`**: Gestión de materiales con filtros
- **`useMaterialSubmit`**: Envío de formularios de materiales
- **`useProductos`**: Gestión de productos
- **`useCollections`**: Gestión de colecciones
- **`useGastosNegocio`**: Gestión de gastos de negocio

### Comunicación
- **`useChat`**: Lógica de chat individual con mensajes
- **`useChatList`**: Lista de conversaciones
- **`useSocket`**: Conexión y eventos de Socket.io
- **`useSocketStatus`**: Estado de conexión Socket.io

### Archivos
- **`useImageUpload`**: Carga de imágenes a Cloudinary
- **`usePDFUpload`**: Carga de PDFs a Cloudinary

### UI y Utilidades
- **`useSidebar`**: Control del sidebar
- **`useNavigationTabs`**: Navegación por pestañas
- **`useAutoScroll`**: Auto-scroll en chats
- **`usePlataformaStyles`**: Estilos según plataforma de mensajería
- **`useOrderCard`**: Lógica para tarjeta de pedido
- **`useAddGarmentForm`**: Formulario para agregar prenda
- **`useUnsavedChanges`**: Gestión de cambios no guardados en formularios

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Crea una build optimizada para producción |
| `npm start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter ESLint |


### Build para Producción

```bash
npm run build
```

El build se optimiza automáticamente y los archivos estáticos se generan en `.next/`.

## Estilos

El proyecto utiliza Tailwind CSS con una configuración personalizada. Los estilos globales se encuentran en `src/app/styles/globals.css`.

## Autenticación

La autenticación se maneja mediante:

- JWT tokens almacenados en localStorage
- Context API para el estado global de autenticación
- Protección de rutas en el cliente (redirección si no autenticado)
- Interceptores HTTP para agregar tokens automáticamente a las peticiones
- Manejo de expiración de tokens y refresh
- Hook `useAuth` para acceso fácil al estado de autenticación

## Integraciones

### Socket.io
El frontend utiliza Socket.io-client para comunicación en tiempo real:
- Recepción de mensajes de Telegram en tiempo real
- Envío de mensajes a través de Socket.io
- Reconexión automática si se pierde la conexión
- Hook `useSocket` para manejo sencillo de conexión

### Cloudinary
Integración con Cloudinary para gestión de archivos:
- Carga de imágenes (productos, materiales, colecciones)
- Carga de PDFs (documentos, presupuestos)
- Transformación y optimización automática
- Hooks `useImageUpload` y `usePDFUpload` para facilitar el uso

### API REST
Cliente HTTP personalizado con:
- Interceptores para agregar tokens JWT
- Manejo centralizado de errores
- Configuración base de URL desde variables de entorno
- Tipado completo con TypeScript

## Responsive Design

La aplicación está diseñada para ser completamente responsive:

- **Mobile**: Optimizado para pantallas pequeñas
- **Tablet**: Adaptación para tablets
- **Desktop**: Experiencia completa en desktop

## Licencia

Este proyecto está bajo la Licencia ISC.

## Equipo

Desarrollado por **equipo1-sp7** para practicas de **FooTalent Group**.
Agradecimiento especial a **EOS Indumentaria** por prestarse como modelo de practicas para el desarrollo de las soluciones.