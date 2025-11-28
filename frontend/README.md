# Frontend - Konfex Web App

Aplicación web frontend para el sistema de gestión de EOS Indumentaria, construida con Next.js 16, React 19, TypeScript y Tailwind CSS.

## 📋 Tabla de Contenidos

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

## ✨ Características

- ✅ Framework Next.js 16 con App Router
- ✅ React 19 con Server Components
- ✅ TypeScript para type safety
- ✅ Tailwind CSS 4 para estilos
- ✅ Formularios con React Hook Form + Zod
- ✅ Autenticación con JWT
- ✅ Manejo de estado con Context API
- ✅ Hooks personalizados para lógica reutilizable
- ✅ Diseño responsive y mobile-first
- ✅ Integración con Cloudinary para imágenes y PDFs

## 🛠 Tecnologías

- **Framework**: Next.js 16.0.3
- **Librería UI**: React 19.2.0
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Formularios**: React Hook Form 7.66.1 + Zod 4.1.12
- **Iconos**: Lucide React
- **Build Tool**: Next.js (Turbopack)

## 📦 Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Backend API corriendo (ver [README del Backend](../backend/README.md))

## 🔧 Instalación

1. **Navegar a la carpeta del frontend:**

```bash
cd frontend
```

2. **Instalar dependencias:**

```bash
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz de la carpeta `frontend` con las siguientes variables:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Ejemplo de `.env.local`

Para desarrollo local:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para producción (si aplica):
```env
NEXT_PUBLIC_API_URL=https://tu-backend-production.com
```

## 🚀 Ejecución

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

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos (imágenes, iconos)
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── calculator/    # Página de calculadora
│   │   ├── inbox/         # Página de inbox
│   │   ├── login/         # Página de login
│   │   ├── materia-prima/ # Gestión de materia prima
│   │   │   └── tela/      # Gestión de telas
│   │   ├── pedidos/       # Página de pedidos
│   │   ├── presupuestos/  # Página de presupuestos
│   │   ├── fonts/         # Fuentes personalizadas
│   │   ├── styles/        # Estilos globales
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página home
│   ├── components/        # Componentes React
│   │   ├── common/        # Componentes comunes reutilizables
│   │   ├── inbox/         # Componentes específicos de inbox
│   │   ├── orders/        # Componentes de pedidos
│   │   ├── providers/     # Context Providers
│   │   └── ui/            # Componentes UI
│   ├── config/            # Configuraciones
│   │   ├── api.config.ts  # Configuración de API
│   │   └── apiClient.ts   # Cliente HTTP
│   ├── contexts/          # Context API
│   │   └── ToastContext.tsx
│   ├── hooks/             # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useBudgets.ts
│   │   ├── useClients.ts
│   │   ├── useMaterials.ts
│   │   └── ...
│   ├── services/          # Servicios de API
│   │   ├── auth.service.ts
│   │   ├── presupuesto.service.ts
│   │   ├── cloudinaryImg.service.ts
│   │   └── cloudinaryPDF.service.ts
│   └── types/             # Definiciones TypeScript
│       ├── auth.types.ts
│       ├── IBudget.ts
│       ├── IFabric.ts
│       └── presupuesto.types.ts
├── next.config.ts         # Configuración de Next.js
├── postcss.config.mjs     # Configuración de PostCSS
├── tsconfig.json          # Configuración TypeScript
└── package.json
```

## 🎯 Features Principales

### 1. **Home**
- Dashboard principal
- Navegación rápida a funciones principales
- Estado de autenticación

### 2. **Autenticación**
- Login con JWT
- Manejo de sesión
- Protección de rutas

### 3. **Presupuestos**
- Creación y gestión de presupuestos
- Cálculo automático de costos
- Exportación a PDF
- Estados: Borrador, Enviado, Aceptado, Rechazado, Vencido

### 4. **Calculadora**
- Cálculo de costos de productos
- Consideración de materiales y mano de obra
- Márgenes de ganancia

### 5. **Clientes**
- Gestión de base de clientes
- Información de contacto
- Historial de presupuestos y pedidos

### 6. **Materia Prima**
- Gestión de materiales
- Control de telas
- Inventario

### 7. **Pedidos**
- Seguimiento de pedidos
- Estados de producción
- Gestión de entregas

### 8. **Inbox**
- Mensajería integrada
- Filtros por plataforma (WhatsApp, Instagram)
- Búsqueda de conversaciones

## 🧩 Componentes

### Componentes Comunes (`components/common/`)

- **Header**: Encabezado principal con menú
- **Sidebar**: Menú lateral deslizable
- **Footer**: Pie de página
- **Button**: Botón reutilizable con variantes
- **Input**: Input de formulario estilizado
- **Toast**: Notificaciones toast
- **SearchBar**: Barra de búsqueda
- **BudgetCard**: Tarjeta de presupuesto
- **MaterialCard**: Tarjeta de material
- **PageHeader**: Encabezado de página

### Componentes UI (`components/ui/`)

- **BudgetForm**: Formulario de presupuesto
- **CostSectionCard**: Tarjeta de sección de costos
- **PriceSummaryCard**: Resumen de precios
- **CustomInput**: Input personalizado
- **CustomSelect**: Select personalizado
- **ImageUploadField**: Campo de carga de imágenes
- **UploadPDFModal**: Modal para subir PDFs
- **NavigationTabs**: Pestañas de navegación

## 🎣 Hooks Personalizados

- **`useAuth`**: Manejo de autenticación y sesión
- **`useBudgets`**: Gestión de presupuestos
- **`useBudgetCalculator`**: Cálculos de presupuesto
- **`useClients`**: Gestión de clientes
- **`useMaterials`**: Gestión de materiales
- **`useImageUpload`**: Carga de imágenes a Cloudinary
- **`usePDFUpload`**: Carga de PDFs a Cloudinary
- **`useSidebar`**: Estado del sidebar
- **`useLogin`**: Lógica de login

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Crea una build optimizada para producción |
| `npm start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter ESLint |

## 🚢 Deployment

### Vercel (Recomendado)

Este proyecto está configurado para deployment automático en Vercel:

1. Conecta tu repositorio a Vercel
2. Las variables de entorno se configuran en el dashboard de Vercel
3. Cada push a la rama principal desplegará automáticamente

El archivo `vercel.json` ya está configurado en la raíz del proyecto.

### Variables de Entorno en Producción

Asegúrate de configurar en Vercel:

- `NEXT_PUBLIC_API_URL`: URL de tu backend en producción

### Build para Producción

```bash
npm run build
```

El build se optimiza automáticamente y los archivos estáticos se generan en `.next/`.

## 🎨 Estilos

El proyecto utiliza Tailwind CSS 4 con una configuración personalizada. Los estilos globales se encuentran en `src/app/styles/globals.css`.

### Colores Principales

El proyecto utiliza una paleta de colores personalizada definida en los estilos globales. Consulta `src/app/styles/globals.css` para ver la configuración completa.

## 🔐 Autenticación

La autenticación se maneja mediante:

- JWT tokens almacenados en localStorage
- Context API para el estado de autenticación
- Protección de rutas en el cliente
- Interceptores HTTP para agregar tokens a las peticiones

## 📱 Responsive Design

La aplicación está diseñada para ser completamente responsive:

- **Mobile**: Optimizado para pantallas pequeñas
- **Tablet**: Adaptación para tablets
- **Desktop**: Experiencia completa en desktop

## 🐛 Troubleshooting

### Error de conexión al backend

- Verifica que el backend esté corriendo en el puerto configurado
- Confirma que `NEXT_PUBLIC_API_URL` en `.env.local` sea correcta
- Verifica la configuración de CORS en el backend

### Errores de build

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

### Problemas con estilos de Tailwind

Si los estilos no se aplican correctamente:

1. Verifica que `postcss.config.mjs` esté configurado
2. Reinicia el servidor de desarrollo
3. Verifica la configuración de Tailwind en `globals.css`

## 📞 Soporte

Para reportar bugs o solicitar features relacionadas con el frontend, por favor abre un issue en el [repositorio de GitHub](https://github.com/FooTalentGroup/konfex-web-app/issues).

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Equipo

Desarrollado por **equipo1-sp7** para **EOS Indumentaria**.
