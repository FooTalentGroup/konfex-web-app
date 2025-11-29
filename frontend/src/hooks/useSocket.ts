import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/services/socket.service';

/**
 * Hook para manejar la conexión Socket.IO
 */
export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conectar al socket cuando el componente se monta
    socketRef.current = getSocket();

    // Cleanup: desconectar cuando el componente se desmonta
    return () => {
      // No desconectamos aquí para mantener la conexión activa
      // Solo limpiamos la referencia
      socketRef.current = null;
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
  };
};

