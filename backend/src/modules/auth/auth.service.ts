import { UserSignUpRequestDto } from "./auth.schema";
import { UserService } from "../user";

export const AuthService = {
    signUp: async ({ email, name, role, password }: UserSignUpRequestDto) => {
        // Validación de negocio
        // Crear usuario
        const user = await UserService.createUser({ email, name, role, password })

        // Configurar DTO
        return (user);
    }
}
