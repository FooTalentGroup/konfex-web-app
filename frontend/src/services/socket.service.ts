import { io, Socket } from 'socket.io-client';
import { SOCKET_CONFIG } from '@/config/socket.config';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const socketUrl = SOCKET_CONFIG.getSocketUrl();
    
    if (socketUrl.includes('localhost:3000') && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        console.warn('⚠️ Socket deshabilitado: entorno de producción detectado pero URL apunta a localhost');
        console.warn('💡 Para habilitar Socket.IO, crea frontend/.env.local con:');
        console.warn('   NEXT_PUBLIC_API_URL=https://konfex-web-app-2.onrender.com/api/v1');
        console.warn('💡 Luego reinicia el servidor de Next.js');
        socket = io(socketUrl, {
          autoConnect: false,
          reconnection: false,
        });
        return socket;
      }
    }
    
    socket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 15000,
      reconnectionAttempts: 1,
      timeout: 10000,
      autoConnect: true,
    });

    let errorLogged = false;

    socket.on('connect', () => {
      errorLogged = false;
    });

    socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
      }
    });

    socket.on('connect_error', (error) => {
      if (!errorLogged) {
        console.warn('⚠️ Socket.IO no disponible:', error.message);
        console.warn('📍 URL intentada:', socketUrl);
        console.warn('💡 El backend puede no tener Socket.IO configurado aún');
        console.warn('💡 Los mensajes seguirán funcionando mediante polling manual');
        errorLogged = true;
      }
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};

