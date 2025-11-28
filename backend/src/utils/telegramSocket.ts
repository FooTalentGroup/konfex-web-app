import { getSocketIO } from '../config/socket';

export interface TelegramMessagePayload {
  chatId: string | number;
  text: string;
  source: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  timestamp: string;
}

export const emitTelegramMessage = (message: TelegramMessagePayload): void => {
  const io = getSocketIO();
  
  if (!io) {
    console.warn('⚠️ Socket.IO no está inicializado. No se puede emitir mensaje de Telegram.');
    return;
  }

  const chatIdStr = message.chatId.toString();
  
  io.emit('telegram_message', message);
  io.to(`chat:${chatIdStr}`).emit('telegram_message', message);
  io.emit('telegram:message', message);
  io.emit('telegram:new_message', message);
  io.emit('message:telegram', message);
  
  console.log(`📤 Mensaje de Telegram emitido para chatId: ${chatIdStr}`, {
    text: message.text.substring(0, 50) + (message.text.length > 50 ? '...' : ''),
    timestamp: message.timestamp,
  });
};

