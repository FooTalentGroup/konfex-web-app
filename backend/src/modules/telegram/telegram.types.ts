export type TelegramMessageData = {
    chatId: string | number;
    text?: string | null;
    type?: string;
    fileId?: string;
    fileUniqueId?: string;
    filePath?: string;
    fileUrl?: string;
    mimeType?: string;
    fileSize?: number;
  
    timestamp?: string | Date; // opcional, prisma ya pone default(now)
    source?: string; // opcional, default("telegram")
  
    clienteId?: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  