import { io } from "@/config/socket";
import { telegramMessageRepository } from "./telegram.repository";
import { uploadFile } from "@/utils/uploadFile";
import { TelegramMessage } from "./telegram.types";

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

export const handleIncomingUpdate = async (update: any) => {
  if (!update.message) return;

  const chatId = update.message.chat.id;
  const from = update.message.from || {};
  const firstName = from.first_name || "Nuevo";
  const lastName = from.last_name || "Cliente";
  const username = from.username || undefined;
  const timestamp = new Date().toISOString();

  let payload: any = {
    chatId,
    firstName,
    lastName,
    username,
    source: "telegram",
    timestamp,
  };

  // Información de mensajes
  if (update.message.text) {
    payload.type = "text";
    payload.text = update.message.text;
  }
  // Fotos
  else if (update.message.photo) {
    const photo = update.message.photo.pop(); // mayor calidad
    payload.type = "photo";
    payload.fileId = photo.file_id;
    payload.fileUniqueId = photo.file_unique_id;
    payload.fileSize = photo.file_size;
  }
  // Documentos
  else if (update.message.document) {
    const doc = update.message.document;
    payload.type = "document";
    payload.fileId = doc.file_id;
    payload.fileUniqueId = doc.file_unique_id;
    payload.fileSize = doc.file_size;
    payload.mimeType = doc.mime_type;
    payload.text = doc.file_name || "Documento recibido";
  }
  // Videos
  else if (update.message.video) {
    const v = update.message.video;
    payload.type = "video";
    payload.fileId = v.file_id;
    payload.fileUniqueId = v.file_unique_id;
    payload.fileSize = v.file_size;
    payload.mimeType = v.mime_type;
  }
  // Audio
  else if (update.message.audio) {
    const a = update.message.audio;
    payload.type = "audio";
    payload.fileId = a.file_id;
    payload.fileUniqueId = a.file_unique_id;
    payload.fileSize = a.file_size;
    payload.mimeType = a.mime_type;
  }
  // Notas de voz
  else if (update.message.voice) {
    const v = update.message.voice;
    payload.type = "voice";
    payload.fileId = v.file_id;
    payload.fileUniqueId = v.file_unique_id;
    payload.fileSize = v.file_size;
    payload.mimeType = v.mime_type;
  } 
  else {
    console.log("Mensaje no manejado", update.message);
    return;
  }

  // Archivos y descargar y subir a Cloudinary
  if (payload.fileId) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const res = await fetch(`${TELEGRAM_API(token)}/getFile?file_id=${payload.fileId}`);
    const data = await res.json() as any;

    if (data.ok) {
      const filePath = data.result.file_path;
      const fileRes = await fetch(`${TELEGRAM_API(token)}/file/bot${token}/${filePath}`);
      const buffer = Buffer.from(await fileRes.arrayBuffer());

      const extension = filePath.split(".").pop() || "file";
      const cloudResult = await uploadFile(buffer, "telegram_files", `chat_${chatId}_${Date.now()}.${extension}`);
      payload.publicUrl = cloudResult.secure_url;
    }
  }

  // Guardar en BD
  await telegramMessageRepository.save(payload);

  // Emitir al frontend
  const msgDataForSocket = {
    chatId: payload.chatId,
    text: payload.text || payload.fileName || "Archivo recibido",
    timestamp: payload.timestamp,
    type: payload.type,
    fileUrl: payload.publicUrl,
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username || undefined,
  };

  io.emit("telegram_message", msgDataForSocket);
};

// ----------------------------

export const sendMessageToTelegram = async (params: {
  chatId: number | string;
  text?: string;
  type?: "text" | "photo" | "document" | "video" | "audio" | "voice";
  fileUrl?: string;
  fileName?: string;
  firstName?: string;
  lastName?: string;
  username?: string | null;
}) => {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const { chatId, text, type = "text", fileUrl, fileName, firstName, lastName, username } = params;

  let url = `${TELEGRAM_API(token)}/sendMessage`;
  const body: any = { chat_id: chatId };

  if (type === "text") body.text = text;
  else if (type === "photo") {
    url = `${TELEGRAM_API(token)}/sendPhoto`;
    body.photo = fileUrl;
    if (text) body.caption = text;
  } else if (type === "document") {
    url = `${TELEGRAM_API(token)}/sendDocument`;
    body.document = fileUrl;
    if (text) body.caption = text;
  } else if (type === "video") {
    url = `${TELEGRAM_API(token)}/sendVideo`;
    body.video = fileUrl;
    if (text) body.caption = text;
  } else if (type === "audio") {
    url = `${TELEGRAM_API(token)}/sendAudio`;
    body.audio = fileUrl;
    if (text) body.caption = text;
  } else if (type === "voice") {
    url = `${TELEGRAM_API(token)}/sendVoice`;
    body.voice = fileUrl;
    if (text) body.caption = text;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  // Guardar en BD
  const msgData: TelegramMessage = {
    chatId,
    text: text || fileName || "Archivo enviado",
    type,
    fileUrl,
    timestamp: new Date().toISOString(),
    firstName,
    lastName,
    username: username || undefined,
  };
  await telegramMessageRepository.save(msgData);

  // Emitir al frontend
  io.emit("telegram_message", msgData);

  return response.json();
};

// ----------------------------

export const associateUser = async (chatId: string | number, clienteId: number) => {
  return telegramMessageRepository.associateUserToChat(chatId, clienteId);
};

export const getChatMessages = async (chatId: string | number) => {
  const messages = await telegramMessageRepository.findByChatId(chatId);
  return messages.map(message => ({
    id: message.id,
    chatId: message.chatId,
    text: message.text,
    type: message.type,
    fileUrl: message.fileUrl,
    filePath: message.filePath,
    mimeType: message.mimeType,
    fileSize: message.fileSize,
    source: message.source,
    firstName: message.firstName,
    lastName: message.lastName,
    username: message.username,
    timestamp: message.timestamp,
  }));
};

export const getChatsList = async () => {
  const allMessages = await telegramMessageRepository.findAll();

  const getLastMessageText = (message: typeof allMessages[number]): string => {
    if (message.text) return message.text;
    switch (message.type) {
      case "photo": return "📷 Foto";
      case "video": return "🎥 Video";
      case "audio": return "🎵 Audio";
      case "document": return "📄 Documento";
      case "voice": return "🎙️ Nota de voz";
      default: return "Mensaje sin contenido";
    }
  };

  const chatsMap = new Map<string, {
    chatId: string;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    lastMessage: string;
    lastMessageSource: string;
    lastTimestamp: Date;
  }>();

  for (const message of allMessages) {
    if (!chatsMap.has(message.chatId)) {
      chatsMap.set(message.chatId, {
        chatId: message.chatId,
        firstName: message.firstName,
        lastName: message.lastName,
        username: message.username,
        lastMessage: getLastMessageText(message),
        lastMessageSource: message.source,
        lastTimestamp: message.timestamp,
      });
    }
  }

  const chats = Array.from(chatsMap.values()).sort(
    (a, b) => b.lastTimestamp.getTime() - a.lastTimestamp.getTime()
  );

  return chats.map(chat => {
    const telegramMessage = allMessages.find(
      msg => msg.chatId === chat.chatId && msg.source === "telegram"
    );

    const firstName = telegramMessage?.firstName || chat.firstName;
    const lastName = telegramMessage?.lastName || chat.lastName;

    const name =
      firstName && lastName
        ? `${firstName} ${lastName}`.trim()
        : firstName || lastName || `Chat ${chat.chatId}`;

    return {
      chatId: chat.chatId,
      name,
      lastMessage: chat.lastMessage,
      lastMessageSource: chat.lastMessageSource,
      timestamp: chat.lastTimestamp,
      hasBudget: false,
    };
  });
};
