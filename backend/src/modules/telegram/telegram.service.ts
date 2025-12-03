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

  console.log(update.message )
  console.log(chatId )
  console.log(from )
  console.log(firstName )
  console.log(lastName )
  console.log(timestamp )

  let payload: any = {
    chatId,
    firstName,
    lastName,
    username,
    source: "telegram",
    timestamp,
  };


  // Determinar tipo de mensaje
  if (update.message && update.message.text) {
    console.log("el mensaje es un texto")
    payload.type = "text";
    payload.text = update.message.text;
  } else if (update.message && update.message.photo) {
    console.log("el mensaje es una foto")
    const photo = update.message.photo.pop(); // mayor calidad
    payload.type = "photo";
    payload.fileId = photo.file_id;
    payload.fileUniqueId = photo.file_unique_id;
    payload.fileSize = photo.file_size;
  } else if (update.message && update.message.document) {
    console.log("el mensaje es un documento")
    const doc = update.message.document;
    payload.type = "document";
    payload.fileId = doc.file_id;
    payload.fileUniqueId = doc.file_unique_id;
    payload.fileSize = doc.file_size;
    payload.mimeType = doc.mime_type;
    payload.text = doc.file_name || "Documento recibido";
  } else if (update.message && update.message.video) {
    console.log("el mensaje es un video")
    const v = update.message.video;
    payload.type = "video";
    payload.fileId = v.file_id;
    payload.fileUniqueId = v.file_unique_id;
    payload.fileSize = v.file_size;
    payload.mimeType = v.mime_type;
  } else if (update.message && update.message.audio) {
    console.log("el mensaje es un audio")
    const a = update.message.audio;
    payload.type = "audio";
    payload.fileId = a.file_id;
    payload.fileUniqueId = a.file_unique_id;
    payload.fileSize = a.file_size;
    payload.mimeType = a.mime_type;
  } else if (update.message && update.message.voice) {
    console.log("el mensaje es una nota de voz")
    const v = update.message.voice;
    payload.type = "voice";
    payload.fileId = v.file_id;
    payload.fileUniqueId = v.file_unique_id;
    payload.fileSize = v.file_size;
    payload.mimeType = v.mime_type;
  } else {
    console.log("Mensaje no manejado", update.message);
    return;
  }

  // Subir archivos a Cloudinary si existe fileId
  if (payload.fileId) {
    console.log("existe payload.fileId", payload.fileId)
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const res = await fetch(`${TELEGRAM_API(token)}/getFile?file_id=${payload.fileId}`);
    const data = await res.json() as any;

    if (data.ok) {
    console.log("existe payload.fileId---data ok")

      const filePath = data.result.file_path;
      const fileRes = await fetch(`${TELEGRAM_API(token)}/file/bot${token}/${filePath}`);
      const buffer = Buffer.from(await fileRes.arrayBuffer());
      const extension = filePath.split(".").pop() || "file";

      const cloudResult = await uploadFile(buffer, "telegram_files", `chat_${chatId}_${Date.now()}.${extension}`);
      payload.fileUrl = cloudResult.secure_url;
    }
  }

  // Guardar en DB y emitir
  await telegramMessageRepository.save(payload);

  const msgDataForSocket: TelegramMessage = {
    chatId: payload.chatId,
    text: payload.text || "Archivo recibido",
    timestamp: payload.timestamp, // string
    type: payload.type,
    fileUrl: payload.fileUrl,
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username || undefined,
  };

  io.emit("telegram_message", msgDataForSocket);
};

// Enviar mensaje a Telegram
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
  else if (type === "photo") { url = `${TELEGRAM_API(token)}/sendPhoto`; body.photo = fileUrl; if (text) body.caption = text; }
  else if (type === "document") { url = `${TELEGRAM_API(token)}/sendDocument`; body.document = fileUrl; if (text) body.caption = text; }
  else if (type === "video") { url = `${TELEGRAM_API(token)}/sendVideo`; body.video = fileUrl; if (text) body.caption = text; }
  else if (type === "audio") { url = `${TELEGRAM_API(token)}/sendAudio`; body.audio = fileUrl; if (text) body.caption = text; }
  else if (type === "voice") { url = `${TELEGRAM_API(token)}/sendVoice`; body.voice = fileUrl; if (text) body.caption = text; }

  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  const msgData: TelegramMessage = {
    chatId,
    text: text || fileName || "Archivo enviado",
    type,
    fileUrl,
    timestamp: new Date().toISOString(), // string
    firstName,
    lastName,
    username: username || undefined,
  };

  await telegramMessageRepository.save(msgData);
  io.emit("telegram_message", msgData);

  return response.json();
};

// Asociar usuario a chat
export const associateUser = async (chatId: string | number, clienteId: number) => {
  return telegramMessageRepository.associateUserToChat(chatId, clienteId);
};

// Obtener mensajes de un chat
export const getChatMessages = async (chatId: string | number) => {
  const messages = await telegramMessageRepository.findByChatId(chatId);
  return messages.map(msg => ({
    id: msg.id,
    chatId: msg.chatId,
    text: msg.text,
    type: msg.type,
    fileUrl: msg.fileUrl,
    filePath: msg.filePath,
    mimeType: msg.mimeType,
    fileSize: msg.fileSize,
    source: msg.source,
    firstName: msg.firstName ?? undefined,
    lastName: msg.lastName ?? undefined,
    username: msg.username ?? undefined,
    timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
  }));
};

// Obtener lista de chats
export const getChatsList = async () => {
  const allMessages = await telegramMessageRepository.findAll();

  const getLastMessageText = (msg: typeof allMessages[number]): string => {
    if (msg.text) return msg.text;
    switch (msg.type) {
      case "photo": return "📷 Foto";
      case "video": return "🎥 Video";
      case "audio": return "🎵 Audio";
      case "document": return "📄 Documento";
      case "voice": return "🎙️ Nota de voz";
      default: return "Mensaje sin contenido";
    }
  };

  const chatsMap = new Map<
    string,
    {
      chatId: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      lastMessage: string;
      lastMessageSource: string;
      lastTimestamp: string;
    }
  >();

  for (const msg of allMessages) {
    if (!chatsMap.has(msg.chatId)) {
      chatsMap.set(msg.chatId, {
        chatId: msg.chatId,
        firstName: msg.firstName ?? undefined,
        lastName: msg.lastName ?? undefined,
        username: msg.username ?? undefined,
        lastMessage: getLastMessageText(msg),
        lastMessageSource: msg.source,
        lastTimestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
      });
    }
  }

  return Array.from(chatsMap.values())
    .sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime())
    .map(chat => {
      const name = chat.firstName && chat.lastName ? `${chat.firstName} ${chat.lastName}` : chat.firstName || chat.lastName || `Chat ${chat.chatId}`;
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
