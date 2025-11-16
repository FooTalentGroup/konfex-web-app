import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger"; // tu logger configurado
import { isAppError } from "../common/errors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log completo
  logger.error(err, "Unhandled error");

  if (isAppError(err)) {
    // Si es AppError, enviamos status y detalles al cliente
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? undefined,
    });
  }

  // Errores inesperados
  return res.status(500).json({
    message: "Internal Server Error",
  });
}
