import prisma from "@/config/prisma";

export const telegramMessageRepository = {
  save: async (data: {
    chatId: string | number;
    text: string;
    timestamp: string;
    source: string;
    userId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  }) => {
    // @ts-expect-error - Prisma model may not be fully typed
    return prisma.telegramMessage.create({
      data: {
        chatId: String(data.chatId),
        text: data.text,
        source: data.source,
        timestamp: new Date(data.timestamp),
        userId: data.userId ?? null,
        firstName: data.firstName ?? "Nuevo",
        lastName: data.lastName ?? "Cliente",
        username: data.username ?? null,
      },
    });
  },

  findByChatId: async (chatId: string | number) => {
    // @ts-expect-error - Prisma model may not be fully typed
    return prisma.telegramMessage.findMany({
      where: { chatId: String(chatId) },
      orderBy: { timestamp: "asc" },
    });
  },

  findAll: async () => {
    // @ts-expect-error - Prisma model may not be fully typed
    return prisma.telegramMessage.findMany({
      orderBy: { timestamp: "desc" },
    });
  },

  associateUserToChat: async (chatId: string | number, userId: number) => {
    // @ts-expect-error - Prisma model may not be fully typed
    return prisma.telegramMessage.updateMany({
      where: { chatId: String(chatId) },
      data: { userId },
    });
  },
};
