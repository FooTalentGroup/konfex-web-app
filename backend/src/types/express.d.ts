import type { ParsedQs } from "qs";
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: ParsedQs;
      validatedParams?: Record<string, string | number>;
    }
  }
}
