import { io } from "@/config/socket";
import { telegramMessageRepository } from "./telegram.repository";

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

export const associateUser = async (chatId: string | number, userId: number) => {
  return telegramMessageRepository.associateUserToChat(chatId, userId);
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
        lastTimestamp: message.timestamp,
      });
    }
  }

  // Convertir el Map a array y ordenar por timestamp descendente
  const chats = Array.from(chatsMap.values()).sort((a, b) => {
    return b.lastTimestamp.getTime() - a.lastTimestamp.getTime();
  });
  
  // Verificar si cada chat tiene presupuestos asociados
  // Por ahora, retornamos hasBudget como false, pero se puede mejorar
  // consultando si el chatId está relacionado con algún cliente que tenga presupuestos
  return chats.map((chat) => ({
    chatId: chat.chatId,
    firstName: chat.firstName,
    lastName: chat.lastName,
    username: chat.username,
    lastMessage: chat.lastMessage,
    timestamp: chat.lastTimestamp,
    hasBudget: false, // TODO: Implementar lógica para verificar presupuestos
  }));
}
