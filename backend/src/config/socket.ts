import { Server as HttpServer } from "http";
import { Server } from "socket.io";

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
      origin: [
        "http://localhost:3000", // frontend local
        "https://konfex-web-app.vercel.app" // frontend producción
      ],
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Frontend conectado via WebSocket", socket);
  });
};
