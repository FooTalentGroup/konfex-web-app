import {io} from "@/config/socket";
import {telegramMessageRepository} from "./telegram.repository";

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`;

export const handleIncomingUpdate = async (update: any) => {
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    const firstName = update.message.from?.first_name || "Nuevo";
    const lastName = update.message.from?.last_name || "Cliente";
    const username = update.message.from?.username || null;
    console.log(chatId, text)

    const msgData = { 
      chatId, 
      text,
      source: "telegram",
      firstName,
      lastName,
      username,
      timestamp: new Date().toISOString(),
    };
  
    console.log("📩 Mensaje recibido del bot:", msgData);
    
    await telegramMessageRepository.save(msgData);

    io.emit("telegram_message", msgData);
  }
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
  
  return messages.map(
    (message) => ({
      id: message.id,
      chatId: message.chatId,
      text: message.text.trim(),
      source: message.source,
      firstName: message.firstName?.trim(),
      lastName: message.lastName?.trim(),
      username: message.username,
      timestamp: message.timestamp,
    }),
  );
}

export const getChatsList = async () => {
  // Obtener todos los mensajes ordenados por timestamp descendente
  const allMessages = await telegramMessageRepository.findAll();
  
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
        lastMessage: message.text,
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
  return await Promise.all(
    chats.map(async (chat) => {
      // Buscar el último mensaje con source "telegram" para obtener el nombre del usuario
      const telegramMessage = allMessages.find(
        (msg: { chatId: string; source: string }) =>
          msg.chatId === chat.chatId && msg.source === "telegram",
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
    }),
  );
}
