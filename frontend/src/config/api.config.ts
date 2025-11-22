const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  return window.location.origin;
};

export const API_CONFIG = {
  getBaseUrl: (): string => getApiBaseUrl(),
  getApiUrl: (endpoint: string): string => {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
};

