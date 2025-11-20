import { UserSignUpRequestDto } from "./auth.schema";
import { UserService } from "../user";
import { AppError } from "@/common/errors";
import { AuthTokens, PasswordHasher } from "@/utils/jwt";

export const AuthService = {
    signUp: async ({ email, name, role, password }: UserSignUpRequestDto) => {
        // Validación de negocio
        // Crear usuario
        const user = await UserService.createUser({ email, name, role, password })

        // Configurar DTO
        return (user);
    },

    signin: async(email: string, password: string) => {
    const user = await UserService.getByEmail(email)
    const isValid = await PasswordHasher.compare(password, user.password);
        if (!isValid) throw new AppError("Credenciales inválidas", 401);

    const tokens = AuthTokens.build({
      id: user.id,
      role: user.role,
    });
    console.log("tokens", tokens)

    return {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      user,
    };
  },
}
