const getApiBaseUrl = (): string => {
  // Prioridad 1: Variable de entorno
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Si estamos en el navegador
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si estamos en localhost, usar localhost:3000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    
    // Si estamos en producción, usar el backend de Render
    return 'https://konfex-web-app-2.onrender.com/api/v1';
  }

  // Fallback para SSR: usar producción
  return 'https://konfex-web-app-2.onrender.com/api/v1';
};

export const API_CONFIG = {
  getBaseUrl: (): string => getApiBaseUrl(),
  getApiUrl: (endpoint: string): string => {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
};

