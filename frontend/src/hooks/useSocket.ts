import { useMemo } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/services/socket.service';

/**
 * Hook para manejar la conexión Socket.IO
 */
export const useSocket = () => {
  const socketInstance = useMemo<Socket | null>(() => getSocket(), []);

  return {
    socket: socketInstance,
    isConnected: socketInstance?.connected ?? false,
  };
};

