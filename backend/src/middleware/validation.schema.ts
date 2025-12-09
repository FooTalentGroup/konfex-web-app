import type { NextFunction, Request, Response } from "express";
import type { ParsedQs } from "qs";
import type { ZodSchema } from "zod";

import { AppError } from "../common/errors";

export const validationSchema =
  <T extends { body?: object; query?: object; params?: object }>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query ?? {},
      params: req.params ?? {},
    });

    if (!result.success) {
      return next(new AppError("Validation failed", 400, result.error.flatten()));
    }

    req.body = result.data.body;
    // En Express 5, req.query y req.params son de solo lectura
    // Usamos propiedades personalizadas para los datos validados
    if (result.data.query) {
      req.validatedQuery = result.data.query as ParsedQs;
    }
    if (result.data.params) {
      req.validatedParams = result.data.params as Record<string, string>;
    }

    next();
  };
