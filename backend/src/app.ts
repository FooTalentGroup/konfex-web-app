import dotenv from 'dotenv';
import type { Express, Request, Response } from 'express';
import express from 'express';
import pinoHttp from 'pino-http';

import { sendError } from './common/responses';
import { corsMiddleware } from './config/cors';
import { setupSwagger } from './config/swagger';
import { errorHandler } from './middleware';
import routes from "./routes";
import logger from './utils/logger';

dotenv.config();

const app: Express = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

setupSwagger(app);

app.use("/api/v1", routes);
app.use((_req: Request, res: Response) => {
  sendError(res, {
    statusCode: 404,
    message: "Ruta no encontrada",
  });
});
app.use(errorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Bienvenido a la API de Konfex",
    version: "1.0.0",
    documentation: "/api/v1/docs",
    health: "/api/v1/health",
  });
});

export { app }