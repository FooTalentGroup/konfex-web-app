# Proyecto EOS Indumentaria (Konfex Web App).
Este repositorio contiene el código fuente para el sistema de gestión de EOS Indumentaria. El proyecto está organizado en un monorepo con carpetas separadas para el frontend y el backend, con el objetivo de optimizar la gestión de pedidos, cálculos de costos y presupuestos

## 2. Estructura de carpetas

/ ├── frontend/ # Código fuente del Frontend (Next.js, TypeScript, Tailwind)  La estructura interna del frontend (`/frontend/src/`) se organiza por *features* (auth, payment, employees, etc.) y carpetas comunes (common, lib, services).

/ ├── backend/ # (Pendiente) Código fuente del Backend 

/ └── README.md # Este archivo

## 3. Pasos para correr el proyecto localmente
Instrucciones para levantar el proyecto de **Frontend** (ubicado en `/frontend`).

1.  **Navegar a la carpeta:**
    ```bash
    cd frontend
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crear un archivo `.env.local` en `/frontend` y añadir la URL del backend local:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
4.  **Ejecutar el proyecto:**
    ```bash
    npm run dev
    ```
    Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 4. Enlaces finales de frontend y backend
* **Frontend (Vercel):** [ konfex-web-app.vercel.app ]
* **Backend (Render/Railway):** [PENDIENTE - AÑADIR ENLACE DEL BACKEND]

## 5. Detalles técnicos relevantes
* **Dominio (Frontend):** `(https://konfex-web-app.vercel.app)`
* **HTTPS (Frontend):** Sí, gestionado automáticamente por Vercel.
* **Puertos (Local):** `3000` (Frontend), `3001` (Backend ).
* **Comandos Build:** `npm run build` (se ejecuta automáticamente en Vercel).
