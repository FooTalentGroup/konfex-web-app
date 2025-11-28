import { app } from './app';
import { createServer } from 'http';
import { initializeSocket } from './config/socket';

const PORT = process.env.PORT ?? 3000;

const httpServer = createServer(app);
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(
    `📚 Documentación de la API: http://localhost:${PORT}/api/v1/docs`
  );
  console.log(`🔍 Check de salud: http://localhost:${PORT}/api/v1/health`);
  console.log(`🔌 Socket.IO disponible en http://localhost:${PORT}`);
});