import { CreateUserPayload } from "./users.types";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";

export const UserRepository = {
  create: async ({ email, name, role, password }: CreateUserPayload) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, name, role, password: hashedPassword },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },
};
