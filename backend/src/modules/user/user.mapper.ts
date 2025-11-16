
import { User } from "@prisma/client";
import { UserResponseDto } from "../auth/auth.types";

export const toUserResponseDto = (user: User): { user: UserResponseDto } => {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};