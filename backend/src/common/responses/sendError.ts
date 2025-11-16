import { Response } from "express";
import { ErrorPayload } from "../types/response.types";

export const sendError = (
  res: Response,
  { statusCode = 400, message, errors = null }: ErrorPayload
) => {
  let normalizedErrors: string[] | Record<string, unknown> | null = null;

  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors && typeof errors === "object") {
    normalizedErrors = errors;
  } else if (typeof errors === "string") {
    normalizedErrors = [errors];
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: normalizedErrors,
  });
};