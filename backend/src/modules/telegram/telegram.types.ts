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
  
  export interface TelegramMessage {
    chatId: string | number;
    text: string;
    timestamp: string;
    type?: "text" | "photo" | "document" | "video" | "audio" | "voice";
    fileUrl?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}
  
  export interface KonfexMessage {
    chatId: number | string;
    text?: string;
    type: "text" | "photo" | "document" | "video" | "audio" | "voice";
    fileUrl?: string;      // URL pública si es multimedia
    fileName?: string;     // nombre del archivo (opcional)
    firstName: string;
    lastName: string;
    username?: string | null;
  }
  
  export interface ServerToClientEvents {
    telegram_message: (msg: TelegramMessage) => void;
  }
  
  export interface ClientToServerEvents {
      konfex_send_message: (data: KonfexMessage) => void;
  }