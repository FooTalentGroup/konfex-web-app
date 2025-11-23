import cors, { CorsOptions } from "cors";

const defaultOrigins = [
    // Local
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",

    // Frontend producción (Vercel)
    "https://konfex-web-app-gilt.vercel.app",

    // Backend producción (Render)
    // (Importante: Render también puede hacer requests internas)
    "https://eos-konfex.onrender.com",
];

// Permitir agregar más orígenes desde variables de entorno
const envOrigins = process.env.CORS_ORIGINS;

const allowedOrigins = envOrigins
    ? envOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : defaultOrigins;

const originIsAllowed = (origin: string): boolean => {
    return allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin === "*") return true;
        return allowedOrigin === origin;
    });
};

export const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // Permitir requests sin origin (ej: Postman)
        if (!origin) {
            callback(null, true);
            return;
        }

        if (originIsAllowed(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

export const corsMiddleware = () => cors(corsOptions);
export const corsPreflightMiddleware = cors(corsOptions);
