import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { corsOptions } from './cors';

let io: SocketServer | null = null;

export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  if (io) {
    return io;
  }

  io = new SocketServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'https://konfex-web-app-gilt.vercel.app',
          'https://konfex-web-app.vercel.app',
          'https://eos-konfex.onrender.com',
          'https://konfex-web-app-omega.vercel.app',
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} is not allowed by CORS policy`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['polling', 'websocket'],
  });

  io.on('connection', (socket: Socket) => {
    console.log('✅ Cliente conectado a Socket.IO:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado de Socket.IO:', socket.id);
    });

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat:${chatId}`);
      console.log(`📱 Cliente ${socket.id} se unió al chat: ${chatId}`);
    });

    socket.on('leave_chat', (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`📱 Cliente ${socket.id} dejó el chat: ${chatId}`);
    });
  });

  console.log('🔌 Socket.IO inicializado correctamente');
  return io;
};

export const getSocketIO = (): SocketServer | null => {
  return io;
};

export const emitTelegramMessage = (message: {
  chatId: string | number;
  text: string;
  source: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  timestamp: string;
}): void => {
  const { emitTelegramMessage: emitMessage } = require('../utils/telegramSocket');
  emitMessage(message);
};

