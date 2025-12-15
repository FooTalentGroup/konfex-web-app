import prisma from "../../config/prisma";

export const telegramMessageRepository = {
  save: async (data: {
    chatId: string | number;
    text?: string;
    timestamp: string;
    source: string;
    clienteId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    type?: string;
    fileId?: string;
    fileUniqueId?: string;
    filePath?: string;
    fileUrl?: string;
    mimeType?: string;
    fileSize?: number;
  }) => {
    return prisma.telegramMessage.create({
      data: {
        chatId: String(data.chatId),
        text: data.text ?? null,
        source: data.source,
        timestamp: new Date(data.timestamp),
        clienteId: data.clienteId ?? null,
        firstName: data.firstName ?? "Nuevo",
        lastName: data.lastName ?? "Cliente",
        username: data.username ?? null,
        type: data.type ?? "text",
        fileId: data.fileId ?? null,
        fileUniqueId: data.fileUniqueId ?? null,
        filePath: data.filePath ?? null,
        fileUrl: data.fileUrl ?? null,
        mimeType: data.mimeType ?? null,
        fileSize: data.fileSize ?? null,
      },
    });
  },

  findByChatId: async (chatId: string | number) => {
    return prisma.telegramMessage.findMany({
      where: { chatId: String(chatId) },
      orderBy: { timestamp: "asc" },
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

  markChatAsRead: async (chatId: string) => {
    return prisma.telegramMessage.updateMany({
      where: {
        chatId,
        leido: false,
      },
      data: {
        leido: true,
      },
    });
  },

  getUnreadCounts: async () => {
    const result = await prisma.telegramMessage.groupBy({
      by: ["chatId"],
      _count: { id: true },
      where: { leido: false },
    });

    const map = new Map<string, number>();
    for (const r of result) {
      map.set(r.chatId, r._count.id);
    }
    return map;
  },
};
