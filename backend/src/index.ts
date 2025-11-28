import { createServer } from "http";
import { app } from "./app";
import { initSocket } from "./config/socket";

const PORT = process.env.PORT ?? 3001; // diferente del frontend

const server = createServer(app);

// Inicializar Socket.IO
initSocket(server);

// Levantar el servidor
server.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación de la API: http://localhost:${PORT}/api/v1/docs`);
  console.log(`🔍 Check de salud: http://localhost:${PORT}/api/v1/health`);
});
