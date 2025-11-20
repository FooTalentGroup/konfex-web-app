
import { User } from "@prisma/client";
import { UserSignInResponseDto, UserSignUpResponseDto } from "../auth/auth.types";

export const toUserSignUpResponseDto = (user: User): UserSignUpResponseDto => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
});

export const toUserSignInResponseDto = (
  user: User,
  token: string,
  refreshToken: string
): UserSignInResponseDto => {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken
  };
};