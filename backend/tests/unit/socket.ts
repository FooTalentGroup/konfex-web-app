import { io as Client } from "socket.io-client";

const socket = Client("http://localhost:3000"); // o la URL de tu backend deployado

socket.on("connect", () => {
  console.log("✅ Conectado al servidor Socket.IO con id:", socket.id);
});

// Escucha los mensajes de Telegram que el backend emite
socket.on("telegram_message", (msg) => {
  console.log("📩 Mensaje recibido por socket:", msg);
});

// Mantener el cliente abierto
setInterval(() => {}, 1000);
