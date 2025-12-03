import {io} from "@/config/socket";
import {telegramMessageRepository} from "./telegram.repository";

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

export const handleIncomingUpdate = async (update: any) => {
  if (!update.message) return;

  const chatId = update.message.chat.id;
  const from = update.message.from || {};
  const firstName = from.first_name || "Nuevo";
  const lastName = from.last_name || "Cliente";
  const username = from.username || null;
  const timestamp = new Date().toISOString();

  let payload: any = {
    chatId,
    firstName,
    lastName,
    username,
    source: "telegram",
    timestamp,
  };

  // informacion de mensajes
  if (update.message.text) {
    payload.type = "text";
    payload.text = update.message.text;
  }

  // Informacion de fotos
  else if (update.message.photo) {
    const photo = update.message.photo.pop(); // última = mayor calidad
    payload.type = "photo";
    payload.fileId = photo.file_id;
    payload.fileUniqueId = photo.file_unique_id;
    payload.fileSize = photo.file_size;
  }

  // informacion de documentos
  else if (update.message.document) {
    const doc = update.message.document;
    payload.type = "document";
    payload.fileId = doc.file_id;
    payload.fileUniqueId = doc.file_unique_id;
    payload.fileSize = doc.file_size;
    payload.mimeType = doc.mime_type;
    payload.text = doc.file_name || "Documento recibido";
  }

  // informacion de video
  else if (update.message.video) {
    const v = update.message.video;
    payload.type = "video";
    payload.fileId = v.file_id;
    payload.fileUniqueId = v.file_unique_id;
    payload.fileSize = v.file_size;
    payload.mimeType = v.mime_type;
  }

  // informacion de audio
  else if (update.message.audio) {
    const a = update.message.audio;
    payload.type = "audio";
    payload.fileId = a.file_id;
    payload.fileUniqueId = a.file_unique_id;
    payload.fileSize = a.file_size;
    payload.mimeType = a.mime_type;
  }

  // informacion de notas de voz
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

  // Si es archivo → obtener file_path y URL de descarga
  if (payload.fileId) {
    const token = process.env.TELEGRAM_TOKENy;
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${payload.fileId}`
    );
    const data = await res.json() as any;

    if (data.ok) {
      payload.filePath = data.result.file_path;
      payload.fileUrl = `https://api.telegram.org/file/bot${token}/${data.result.file_path}`;
    }
  }

  // Guardar en BD
  console.log(payload)
  await telegramMessageRepository.save(payload);

  // Emitir al frontend en tiempo real
  io.emit("telegram_message", payload);
};


export const sendTextMessage = async (chatId: number | string, text: string, firstName: string, lastName: string, username: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const url = `${TELEGRAM_API(token)}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

    const msgData = {
        chatId,
        text,
        source: "konfex",
        firstName,
        lastName,
        username,
        timestamp: new Date().toISOString(),
    };

    console.log("Mensaje enviado al bot:", msgData);
    await telegramMessageRepository.save(msgData);

  return response.json();
};

export const associateUser = async (chatId: string | number, clienteId: number) => {
  return telegramMessageRepository.associateUserToChat(chatId, clienteId);
}

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
}

export const getChatsList = async () => {
  const allMessages = await telegramMessageRepository.findAll();

  // Función para mostrar un mensaje representativo
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

  // Agrupar por chatId, tomando el primer mensaje (más reciente) de cada chat
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
        lastMessage: getLastMessageText(message), // aquí usamos la función
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
      lastMessage: chat.lastMessage, // siempre es string
      lastMessageSource: chat.lastMessageSource,
      timestamp: chat.lastTimestamp,
      hasBudget: false,
    };
  });
};

