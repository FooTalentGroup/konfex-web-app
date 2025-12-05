import prisma from "../../config/prisma";

export const messageReadRepository = {
  markAsRead: async (messageId: number, userId: number) => {
    return prisma.messageRead.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
      create: {
        messageId,
        userId,
      },
      update: {
        readAt: new Date(),
      },
    });
  },

  markChatAsRead: async (chatId: string, userId: number) => {
    // Obtener todos los mensajes del chat que no fueron enviados por el usuario
    const messages = await prisma.telegramMessage.findMany({
      where: {
        chatId,
        source: "telegram", // Solo marcar como leídos los mensajes que vienen de telegram (no los que enviamos)
      },
      select: {
        id: true,
      },
    });

    // Marcar todos los mensajes como leídos
    const messageIds = messages.map((msg) => msg.id);
    
    if (messageIds.length === 0) {
      return { count: 0 };
    }

    // Usar createMany con skipDuplicates para evitar errores si ya existen
    await prisma.messageRead.createMany({
      data: messageIds.map((messageId) => ({
        messageId,
        userId,
      })),
      skipDuplicates: true,
    });

    // Actualizar readAt para los que ya existían
    await prisma.messageRead.updateMany({
      where: {
        messageId: { in: messageIds },
        userId,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { count: messageIds.length };
  },

  getUnreadCount: async (chatId: string, userId: number): Promise<number> => {
    // Contar mensajes del chat que:
    // 1. Vienen de telegram (source = "telegram")
    // 2. No han sido leídos por el usuario
    const count = await prisma.telegramMessage.count({
      where: {
        chatId,
        source: "telegram",
        NOT: {
          readBy: {
            some: {
              userId,
            },
          },
        },
      },
    });

    return count;
  },

  getUnreadCountsByChat: async (userId: number): Promise<Map<string, number>> => {
    // Obtener todos los chats únicos
    const chats = await prisma.telegramMessage.findMany({
      select: {
        chatId: true,
      },
      distinct: ["chatId"],
    });

    const chatIds = chats.map((chat) => chat.chatId);
    const unreadCounts = new Map<string, number>();

    // Para cada chat, contar mensajes no leídos
    for (const chatId of chatIds) {
      const count = await messageReadRepository.getUnreadCount(chatId, userId);
      if (count > 0) {
        unreadCounts.set(chatId, count);
      }
    }

    return unreadCounts;
  },
};

