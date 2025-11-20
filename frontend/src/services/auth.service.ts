import { SignInRequest, SignInResponse, ApiResponse } from '@/types/auth.types';

export const authService = {
  signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
    const url = '/api/v1/auth/sign-in';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (response.status === 404) {
          throw new Error(`Ruta no encontrada. Verifica que el backend esté corriendo y que la ruta /api/v1/auth/sign-in exista.`);
        }
        throw new Error(`Error del servidor (${response.status}): ${text.substring(0, 100)}`);
      }

      const data: ApiResponse<SignInResponse> = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Error al iniciar sesión';
        const errors = data.errors || [];
        throw new Error(errors.length > 0 ? errors.join(', ') : errorMessage);
      }

      if (!data.success || !data.data) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error(`No se pudo conectar con el servidor. Verifica que el backend esté corriendo.`);
        }
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};

