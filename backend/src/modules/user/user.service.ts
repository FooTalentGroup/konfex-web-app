// import { USER_ROLES } from "../user/users.types";
import { AppError } from "../../common/errors";
import { UserRepository } from "../user/user.repository";
import { UserSignUpRequestDto } from "../auth/auth.schema";

export const UserService = {
    createUser : async ({ email, name, role, password }: UserSignUpRequestDto) => {
        // Validación de negocio
        // if (!email) {
        //     throw new AppError("El email es obligatorio", 400);
        // }

        // Verificar si el usuario existe
        const exists = await UserRepository.findByEmail(email);

        if (exists) {
            throw new AppError("El usuario ya existe", 409);
        }

        // Crear usuario
        // if (!USER_ROLES.includes(role)) {
        //     throw new AppError("Rol de usuario inválido", 400);
        // }

        // Crear usuario
        return UserRepository.create({ email, name, role, password });
    }
}
