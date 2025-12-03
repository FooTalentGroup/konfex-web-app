import prisma from "../../config/prisma";

export const telegramMessageRepository = {
  save: async (data: {
    chatId: string | number;
    text: string;
    timestamp: string;
    source: string;
    clienteId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  }) => {
    return prisma.telegramMessage.create({
      data: {
        chatId: String(data.chatId),
        text: data.text,
        source: data.source,
        timestamp: new Date(data.timestamp),
        clienteId: data.clienteId ?? null,
        firstName: data.firstName ?? "Nuevo",
        lastName: data.lastName ?? "Cliente",
        username: data.username ?? null,
      },
    });
  },

  findByChatId: async (chatId: string | number) => {
    return prisma.telegramMessage.findMany({ 
      where: { chatId: String(chatId) },
      orderBy: { timestamp: 'asc' }
    });
  },

  findAll: async () => {
    return prisma.telegramMessage.findMany({
      orderBy: { timestamp: "desc" },
    });
  },

  associateUserToChat: async (chatId: string | number, clienteId: number) => {
    return prisma.telegramMessage.updateMany({
      where: { chatId: String(chatId) },
      data: { clienteId },
    });
  },
};
