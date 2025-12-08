import { io } from "@/config/socket";
import prisma from "@/config/prisma";
import { telegramMessageRepository } from "./telegram.repository";
import { uploadFile } from "@/utils/uploadFile";

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

type TelegramGetFileResponse = {
  ok: boolean;
  result: {
    file_id: string;
    file_size?: number;
    file_path: string;
  };
};

export const handleIncomingUpdate = async (update: any) => {
  if (!update.message) return;

  const { message } = update;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const payload: any = {
    chatId: message.chat.id.toString(),
    source: "telegram",
    firstName: message.from?.first_name || "Nuevo",
    lastName: message.from?.last_name || "Cliente",
    username: message.from?.username || null,
    timestamp: new Date().toISOString(),
  };

  try {
    if (message.text) {
      payload.type = "text";
      payload.text = message.text;
    } else if (message.photo) {
      const photos = message.photo;
      const largestPhoto = photos[photos.length - 1];

      payload.type = "photo";
      payload.fileId = largestPhoto.file_id;
      payload.fileUniqueId = largestPhoto.file_unique_id;
      payload.fileSize = largestPhoto.file_size;

      // Obtener URL temporal de Telegram
      const fileInfo = (await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${payload.fileId}`
      ).then((res) => res.json())) as TelegramGetFileResponse;
      const telegramFileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;

      // Subir a Cloudinary usando tu util
      const cloudinaryRes = await uploadFile({
        url: telegramFileUrl,
        folder: "telegram_photos",
        filename: payload.fileUniqueId,
      });
      payload.fileUrl = cloudinaryRes.secure_url;
      payload.filePath = `telegram_photos/${payload.fileUniqueId}`;
    } else if (message.document) {
      payload.type = "document";
      payload.fileId = message.document.file_id;
      payload.fileUniqueId = message.document.file_unique_id;
      payload.mimeType = message.document.mime_type;
      payload.fileSize = message.document.file_size;

      // Si hay caption (texto junto con el documento), agregarlo
      if (message.caption) {
        payload.text = message.caption;
      }

      // Obtener file_path desde Telegram
      const fileInfo = (await fetch(
        `https://api.telegram.org/bot${botToken}/getFile?file_id=${payload.fileId}`
      ).then((res) => res.json())) as TelegramGetFileResponse;

      if (!fileInfo.ok) throw new Error("No se pudo obtener el archivo de Telegram");

      const telegramFileUrl = `https://api.telegram.org/file/bot${botToken}/${fileInfo.result.file_path}`;

      // Descargar a Buffer usando arrayBuffer()
      const response = await fetch(telegramFileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determinar la extensión del archivo desde el mimeType o usar .pdf por defecto
      let extension = ".pdf";
      if (payload.mimeType) {
        const mimeToExt: Record<string, string> = {
          "application/pdf": ".pdf",
          "application/msword": ".doc",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
          "image/jpeg": ".jpg",
          "image/png": ".png",
        };
        extension = mimeToExt[payload.mimeType] || ".pdf";
      }

      // Subir a Cloudinary usando tu util
      const cloudinaryRes = await uploadFile({
        buffer,
        folder: "telegram_documents",
        filename: `${payload.fileUniqueId}${extension}`,
        resource_type: "raw",
      });

      // La URL de Cloudinary para archivos raw es directamente accesible
      payload.fileUrl = cloudinaryRes.secure_url;
      payload.filePath = `telegram_documents/${payload.fileUniqueId}${extension}`;

      console.log("📄 Documento procesado:", {
        type: payload.type,
        mimeType: payload.mimeType,
        fileSize: payload.fileSize,
        fileUrl: payload.fileUrl,
        filePath: payload.filePath,
      });
    }

    console.log("📩 Mensaje recibido del bot:", payload);

    await telegramMessageRepository.save(payload);
    io.emit("telegram_message", payload);
  } catch (err) {
    console.error("Error procesando mensaje de Telegram:", err);
  }
};

export const sendTextMessage = async (
  chatId: number | string,
  text: string,
  firstName: string,
  lastName: string,
  username: string
) => {
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
};

export const getChatMessages = async (chatId: string | number) => {
  const messages = await telegramMessageRepository.findByChatId(chatId);

  return messages.map((message) => ({
    id: message.id,
    chatId: message.chatId,
    text: message.text?.trim() || null,
    source: message.source,
    firstName: message.firstName?.trim() || null,
    lastName: message.lastName?.trim() || null,
    username: message.username || null,
    timestamp: message.timestamp,
    // Campos para archivos multimedia
    type: message.type || "text",
    fileId: message.fileId || null,
    fileUniqueId: message.fileUniqueId || null,
    filePath: message.filePath || null,
    fileUrl: message.fileUrl || null,
    mimeType: message.mimeType || null,
    fileSize: message.fileSize || null,
  }));
};

export const getClienteDataFromChat = async (chatId: string | number) => {
  // Buscar el primer mensaje de Telegram del chat para obtener datos básicos
  const telegramMessage = await telegramMessageRepository.findByChatId(chatId);
  const firstTelegramMsg = telegramMessage.find((msg) => msg.source === "telegram");

  if (!firstTelegramMsg) {
    return null;
  }

  // Si el mensaje tiene clienteId asociado, obtener datos completos del cliente
  if (firstTelegramMsg.clienteId) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: firstTelegramMsg.clienteId },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
      },
    });

    if (cliente) {
      return {
        clienteId: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email || null,
        telefono: cliente.telefono || null,
      };
    }
  }

  // Si no hay cliente asociado, retornar datos básicos del mensaje de Telegram
  const nombre =
    firstTelegramMsg.firstName && firstTelegramMsg.lastName
      ? `${firstTelegramMsg.firstName} ${firstTelegramMsg.lastName}`.trim()
      : firstTelegramMsg.firstName || firstTelegramMsg.lastName || null;

  return {
    clienteId: null,
    nombre: nombre,
    email: null, // Telegram no proporciona email directamente
    telefono: null, // Telegram no proporciona teléfono directamente
  };
};

export const getChatsList = async () => {
  // Obtener todos los mensajes ordenados por timestamp descendente
  const allMessages = await telegramMessageRepository.findAll();
  const getLastMessageText = (msg: (typeof allMessages)[number]): string => {
    if (msg.text) return msg.text;
    switch (msg.type) {
      case "photo":
        return "Foto";
      case "video":
        return "Video";
      case "audio":
        return "Audio";
      case "document":
        return "Documento";
      case "voice":
        return "Nota de voz";
      default:
        return "Mensaje sin contenido";
    }
  };

  // Agrupar por chatId, tomando el primer mensaje (más reciente) de cada chat
  const chatsMap = new Map<
    string,
    {
      chatId: string;
      firstName?: string | null;
      lastName?: string | null;
      username?: string | null;
      lastMessage: string;
      lastMessageSource: string;
      lastTimestamp: Date;
    }
  >();

  for (const message of allMessages) {
    if (!chatsMap.has(message.chatId)) {
      chatsMap.set(message.chatId, {
        chatId: message.chatId,
        firstName: message.firstName,
        lastName: message.lastName,
        username: message.username,
        // modificar para recibir el ultimo mensaje
        lastMessage: getLastMessageText(message),
        lastMessageSource: message.source,
        lastTimestamp: message.timestamp,
      });
    }
  }

  // Convertir el Map a array y ordenar por timestamp descendente
  const chats = Array.from(chatsMap.values()).sort((a, b) => {
    return b.lastTimestamp.getTime() - a.lastTimestamp.getTime();
  });

  // Para cada chat, obtener el nombre del usuario con source "telegram"
  // Si no existe, usar el último mensaje con source "telegram" para obtener el nombre
  return chats.map((chat) => {
    // Buscar el último mensaje con source "telegram" para obtener el nombre del usuario
    const telegramMessage = allMessages.find(
      (msg: { chatId: string; source: string }) =>
        msg.chatId === chat.chatId && msg.source === "telegram"
    );

    // Usar el nombre del mensaje de telegram si existe, sino usar el del último mensaje
    const firstName = telegramMessage?.firstName || chat.firstName;
    const lastName = telegramMessage?.lastName || chat.lastName;

    // Concatenar firstName y lastName
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
