import jwt from "jsonwebtoken";

import { AppError } from "@/common/errors";
import { AuthTokens, PasswordHasher } from "@/utils/jwt";

import { UserService } from "../user";
import type { UserSignUpRequestDto } from "./auth.schema";
import { RefreshTokenService } from "./refresh-token.service";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!;

export const AuthService = {
  signUp: async ({ email, name, role, password }: UserSignUpRequestDto) => {
    const user = await UserService.createUser({ email, name, role, password });
    return user;
  },

  signin: async (email: string, password: string) => {
    const user = await UserService.getByEmail(email);
    const isValid = await PasswordHasher.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Credenciales inválidas", 401);
    }

    const tokens = AuthTokens.build({
      id: user.id,
      role: user.role,
    });

    await RefreshTokenService.createRefreshToken(user.id, tokens.refreshToken);

    return {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user,
    };
  },

  refresh: async (refreshToken: string) => {
    const storedToken = await RefreshTokenService.findValidRefreshToken(refreshToken);

    if (!storedToken) {
      throw new AppError("Refresh token inválido o expirado", 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: number; role: string };

      if (decoded.id !== storedToken.userId) {
        throw new AppError("Token inválido", 401);
      }

      await RefreshTokenService.revokeRefreshToken(refreshToken); // Generar nuevos tokens
      const newTokens = AuthTokens.build({
        id: storedToken.user.id as number,
        role: storedToken.user.role,
      });

      await RefreshTokenService.createRefreshToken(
        storedToken.user.id as number,
        newTokens.refreshToken
      );

      return {
        token: newTokens.token,
        refreshToken: newTokens.refreshToken,
      };
    } catch {
      await RefreshTokenService.revokeRefreshToken(refreshToken);
      throw new AppError("Refresh token inválido", 401);
    }
  },

  signOut: async (userId?: number, refreshToken?: string) => {
    if (refreshToken) {
      try {
        await RefreshTokenService.revokeRefreshToken(refreshToken);
      } catch {
        // Ignorar
      }
    }

    if (userId) {
      await RefreshTokenService.revokeAllUserTokens(userId);
    }

    return { success: true, message: "Sesión cerrada exitosamente" };
  },
};
