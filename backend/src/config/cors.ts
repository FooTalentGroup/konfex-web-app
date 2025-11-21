import cors, { CorsOptions } from "cors";

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001"
];

const originIsAllowed = (origin: string): boolean => {
  return defaultOrigins.some((allowedOrigin) => {
    if (allowedOrigin === "*") {
      return true;
    }

    return allowedOrigin === origin;
  });
};

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
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
