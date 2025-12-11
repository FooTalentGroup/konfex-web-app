import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import { toUserSignInResponseDto, toUserSignUpResponseDto } from "../user/user.mapper";
import type { UserSignInRequestDto, UserSignUpRequestDto } from "./auth.schema";
import { AuthService } from "./auth.service";

export const signUpController = controllerHandler(
  async (req: Request) => {
    const { email, name, role, password }: UserSignUpRequestDto = req.body;
    const user = await AuthService.signUp({ email, name, role, password });
    return toUserSignUpResponseDto(user);
  },
  "Usuario creado exitosamente",
  201
);

export const signInController = controllerHandler(
  async (req: Request) => {
    const { email, password }: UserSignInRequestDto = req.body;
    const { user, token, refreshToken } = await AuthService.signin(email, password);
    return toUserSignInResponseDto(user, token, refreshToken);
  },
  "Login exitoso",
  201
);

export const refreshController = controllerHandler(
  async (req: Request) => {
    const { refreshToken } = req.body;

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new Error("Refresh token requerido");
    }

    const tokens = await AuthService.refresh(refreshToken);
    return tokens;
  },
  "Token renovado exitosamente",
  200
);

export const signOutController = controllerHandler(
  async (_req: Request) => {
    await AuthService.signOut();
    return { success: true };
  },
  "Sesión cerrada exitosamente",
  200
);
