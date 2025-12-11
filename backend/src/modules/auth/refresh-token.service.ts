import crypto from "crypto";

import { prisma } from "@/config/prisma";

export const RefreshTokenService = {
  createRefreshToken: async (userId: number, token: string, expiresInDays: number = 7) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  },

  findValidRefreshToken: async (token: string) => {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken) {
      return null;
    }

    if (refreshToken.revoked) {
      return null;
    }

    if (new Date() > refreshToken.expiresAt) {
      return null;
    }

    return refreshToken;
  },

  revokeRefreshToken: async (token: string) => {
    return await prisma.refreshToken.update({
      where: { token },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  },

  revokeAllUserTokens: async (userId: number) => {
    return await prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  },

  cleanExpiredTokens: async () => {
    const now = new Date();
    return await prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { revoked: true }],
      },
    });
  },

  generateUniqueToken: () => {
    return crypto.randomBytes(64).toString("hex");
  },
};
