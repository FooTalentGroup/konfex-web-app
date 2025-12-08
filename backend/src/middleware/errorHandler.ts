import type { NextFunction, Request, Response } from "express";

import { isAppError } from "../common/errors";
import logger from "../utils/logger";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err, "Unhandled error");

  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? undefined,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
