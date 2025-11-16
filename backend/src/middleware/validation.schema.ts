import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ParsedQs } from "qs";
import { AppError } from "../common/errors";

export const validationSchema = <
  T extends { body: object; query?: object; params?: object }
>(
  schema: ZodSchema<T>
) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query ?? {},
    params: req.params ?? {},
  });
  
  if (!result.success) {
    return next(new AppError("Validation failed", 400, result.error.flatten()));
  }
  
  req.body = result.data.body;
  if (result.data.query) req.query = result.data.query as ParsedQs;
  if (result.data.params) req.params = result.data.params as Record<string, string>;
  
  next();
};
