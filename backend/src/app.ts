import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';
import pinoHttp from 'pino-http';
import logger from './utils/logger';
import { errorHandler } from './middleware';
import { sendError } from './common/responses';
import routes from "./routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
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