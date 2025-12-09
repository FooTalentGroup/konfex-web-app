import jwt from "jsonwebtoken";
import { AppError } from "@/common/errors";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No se proporcionó token", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw new AppError("Token inválido", 401);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new AppError("Token expirado o inválido", 401);
  }
};
