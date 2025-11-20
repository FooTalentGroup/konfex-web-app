import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserRole } from "@/modules/user/users.types";

export const PasswordHasher = {
  compare: (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },
};

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

type Payload = {
  id: number;
  role: UserRole;
};

export const AuthTokens = {
  build: (payload: Payload) => ({
    token: jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }),
    refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" }),
  }),
};
