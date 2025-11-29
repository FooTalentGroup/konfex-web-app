import { API_CONFIG } from './api.config';

export const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    let socketUrl = apiUrl.replace(/\/api\/v1$/, '');
    socketUrl = socketUrl.replace(/\/$/, '');
    console.log('🌐 URL base API (desde env):', apiUrl);
    console.log('🔌 URL Socket.IO:', socketUrl);
    return socketUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const socketUrl = 'http://localhost:3000';
      console.log('🌐 Entorno local detectado');
      console.log('🔌 URL Socket.IO:', socketUrl);
      return socketUrl;
    }
    
    const socketUrl = 'https://konfex-web-app-2.onrender.com';
    console.log('🌐 Entorno de producción detectado (hostname:', hostname, ')');
    console.log('🔌 URL Socket.IO (Render):', socketUrl);
    return socketUrl;
  }

  const socketUrl = 'https://konfex-web-app-2.onrender.com';
  console.log('🌐 Usando URL por defecto (Render - producción)');
  console.log('🔌 URL Socket.IO:', socketUrl);
  return socketUrl;
};

export const SOCKET_CONFIG = {
  getSocketUrl,
};

