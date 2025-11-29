import { useState, useEffect } from 'react';
import { isSocketConnected } from '@/services/socket.service';

export const useSocketStatus = (checkInterval: number = 1000) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(isSocketConnected());

    const interval = setInterval(() => {
      setIsConnected(isSocketConnected());
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval]);

  return isConnected;
};

