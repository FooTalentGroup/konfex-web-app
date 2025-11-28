import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export interface TelegramMessage {
  chatId: number;
  text: string;
  timestamp: string;
}

export interface ServerToClientEvents {
  telegram_message: (msg: TelegramMessage) => void;
}

export interface ClientToServerEvents {}

export let io: Server<ClientToServerEvents, ServerToClientEvents>;

export const initSocket = (server: HttpServer) => {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", () => {
    console.log("🔌 Frontend conectado via WebSocket");
  });
};
