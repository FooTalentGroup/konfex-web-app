import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import {sendMessageToTelegram} from "@modules/telegram/telegram.service";
import { ClientToServerEvents, KonfexMessage, ServerToClientEvents } from "@/modules/telegram/telegram.types";


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
    console.log("🔌 Frontend conectado via WebSocket", socket.id);
    socket.on("konfex_send_message", async (msg: KonfexMessage) => {
      try {
        await sendMessageToTelegram(msg);
      } catch (err) {
        console.error("Error enviando mensaje desde WebSocket:", err);
      }
    });
  });
};
