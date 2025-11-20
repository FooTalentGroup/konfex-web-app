// import { USER_ROLES } from "../user/users.types";
import { AppError } from "../../common/errors";
import { UserRepository } from "../user/user.repository";
import { UserSignUpRequestDto } from "../auth/auth.schema";

export const UserService = {
    createUser : async ({ email, name, role, password }: UserSignUpRequestDto) => {
        const exists = await UserRepository.findByEmail(email);
        if (exists) {
            throw new AppError("El usuario ya existe", 409);
        }
        return UserRepository.create({ email, name, role, password });
    },

    getByEmail: async (email: string) => {
        const user = await UserRepository.findByEmail(email);
        if (!user) throw new AppError("Credenciales inválidas", 401);

        return user;
    },
}
