import cors, { CorsOptions } from "cors";

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://konfex-web-app-gilt.vercel.app",
  "https://konfex.vercel.app",
  "https://konfex-web-app.vercel.app",

  // Backend producción (Render)
  "https://eos-konfex.onrender.com",
  "https://konfex-web-app-omega.vercel.app"
];

const envOrigins = process.env.CORS_ORIGINS;

const allowerdOrigins = envOrigins
  ? envOrigins
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : defaultOrigins;

const originIsAllowed = (origin: string): boolean => {
  return allowerdOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "*") {
      return true;
    }

    return allowedOrigin === origin;
  });
};

export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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
  optionsSuccessStatus: 204,
};

export const corsMiddleware = () => cors(corsOptions);
export const corsPreflightMiddleware = cors(corsOptions);
