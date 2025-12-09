import { API_CONFIG } from './api.config';

export const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let socketUrl = apiUrl.replace(/\/api\/v1$/, '');
    socketUrl = socketUrl.replace(/\/$/, '');
    return socketUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const socketUrl = 'http://localhost:3000';
      return socketUrl;
    }
    
    const socketUrl = 'https://konfex-web-app-2.onrender.com';
    return socketUrl;
  }

  const socketUrl = 'https://konfex-web-app-2.onrender.com';
  return socketUrl;
};

export const SOCKET_CONFIG = {
  getSocketUrl,
};

