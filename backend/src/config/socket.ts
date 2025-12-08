import { sendTextMessage } from "@modules/telegram/telegram.service";
import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

export interface TelegramMessage {
  chatId: number;
  text: string;
  timestamp: string;
}

export interface KonfexMessage {
  chatId: number;
  text: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface ServerToClientEvents {
  telegram_message: (msg: TelegramMessage) => void;
}

export interface ClientToServerEvents {
  konfex_send_message: (data: KonfexMessage) => void;
}

export let io: Server<ClientToServerEvents, ServerToClientEvents>;

export const initSocket = (server: HttpServer) => {
  io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: ["http://localhost:3000", "https://konfex-web-app.vercel.app"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("konfex_send_message", async ({ chatId, text, firstName, lastName, username }) => {
      await sendTextMessage(chatId, text, firstName, lastName, username);
    });
  });
};
