import type { Response } from "express";

import type { SuccessPayload } from "../types/response.types";

export const sendSuccess = <T>(
  res: Response,
  { statusCode = 200, message, data = null }: SuccessPayload<T>
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};