import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { UserSignUpRequestDto } from "./auth.schema";
import { AuthService } from "./auth.service";
import { toUserResponseDto } from "../user/user.mapper";

// Crear usuario
export const signUpController = controllerHandler(
  async (req: Request) => {
    const { email, name, role, password } : UserSignUpRequestDto  = req.body;
    const user =  await AuthService.signUp({ email, name, role, password });
    return toUserResponseDto(user)
  },
  "Usuario creado exitosamente",
  201
);