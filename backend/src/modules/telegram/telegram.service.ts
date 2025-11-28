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

export const sendTextMessage = async (chatId: number | string, text: string) => {
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

  return response.json();
};

export const associateUser = async (chatId: string | number, userId: number) => {
  return telegramMessageRepository.associateUserToChat(chatId, userId);
}
