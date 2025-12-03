import prisma from "@/config/prisma";
import { TelegramMessageData } from "./telegram.types";

export const telegramMessageRepository = {
  save: async (data: TelegramMessageData) => {
    // Construimos el objeto dinámicamente
    const saveData: any = {
      chatId: String(data.chatId),
      type: data.type ?? "text",
      timestamp: data.timestamp ? new Date(data.timestamp) : undefined, // usa default(now)
      source: data.source ?? "telegram",
      clienteId: data.clienteId,
      firstName: data.firstName ?? "Nuevo",
      lastName: data.lastName ?? "Cliente",
      username: data.username,
    };

    if (data.text) saveData.text = data.text;
    if (data.fileId) saveData.fileId = data.fileId;
    if (data.fileUniqueId) saveData.fileUniqueId = data.fileUniqueId;
    if (data.filePath) saveData.filePath = data.filePath;
    if (data.fileUrl) saveData.fileUrl = data.fileUrl;
    if (data.mimeType) saveData.mimeType = data.mimeType;
    if (data.fileSize) saveData.fileSize = data.fileSize;

    return prisma.telegramMessage.create({ data: saveData });
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
};
