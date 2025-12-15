import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  ApiResponse,
} from "@/types/auth.types";
import { API_CONFIG } from "@/config/api.config";
import {
  clearTokens,
  getToken,
  getRefreshToken,
  saveToken,
  saveRefreshToken,
} from "@/utils/token.utils";

export const authService = {
  signUp: async (credentials: SignUpRequest): Promise<SignUpResponse> => {
    const url = API_CONFIG.getApiUrl("/auth/sign-up");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name || null,
          role: credentials.role || "USER",
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        if (response.status === 404) {
          throw new Error(
            `Ruta no encontrada. Verifica que el backend esté corriendo y que la ruta /api/v1/auth/sign-up exista.`
          );
        }
        throw new Error(
          `Error del servidor (${response.status}): ${text.substring(0, 100)}`
        );
      }

      const data: ApiResponse<SignUpResponse> = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Error al registrar usuario";
        const errors = data.errors || [];
        throw new Error(errors.length > 0 ? errors.join(", ") : errorMessage);
      }

      if (!data.success || !data.data) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          const apiUrl = API_CONFIG.getBaseUrl();
          throw new Error(
            `No se pudo conectar con el servidor en ${apiUrl}. Verifica que el backend esté corriendo y que la variable NEXT_PUBLIC_API_URL esté configurada correctamente.`
          );
        }
        throw error;
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
    const url = API_CONFIG.getApiUrl("/auth/sign-in");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        if (response.status === 404) {
          throw new Error(
            `Ruta no encontrada. Verifica que el backend esté corriendo y que la ruta /api/v1/auth/sign-in exista.`
          );
        }
        throw new Error(
          `Error del servidor (${response.status}): ${text.substring(0, 100)}`
        );
      }

      const data: ApiResponse<SignInResponse> = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Error al iniciar sesión";
        const errors = data.errors || [];
        throw new Error(errors.length > 0 ? errors.join(", ") : errorMessage);
      }

      if (!data.success || !data.data) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          const apiUrl = API_CONFIG.getBaseUrl();
          throw new Error(
            `No se pudo conectar con el servidor en ${apiUrl}. Verifica que el backend esté corriendo y que la variable NEXT_PUBLIC_API_URL esté configurada correctamente.`
          );
        }
        throw error;
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  signOut: async (): Promise<void> => {
    const url = API_CONFIG.getApiUrl("/auth/sign-out");

    try {
      const token = getToken();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.warn(
          "Error al cerrar sesión en el servidor, pero continuando con el logout local"
        );
      }
    } catch (error) {
      console.warn(
        "Error al comunicarse con el servidor durante logout:",
        error
      );
    } finally {
      clearTokens();
    }
  },

  refreshToken: async (): Promise<{
    token: string;
    refreshToken: string;
  } | null> => {
    const url = API_CONFIG.getApiUrl("/auth/refresh");

    try {
      const currentRefreshToken = getRefreshToken();

      if (!currentRefreshToken) {
        console.warn("No hay refresh token disponible");
        return null;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        return null;
      }

      const data: ApiResponse<{ token: string; refreshToken: string }> =
        await response.json();

      if (!response.ok || !data.success || !data.data) {
        console.warn("Error al renovar token:", data.message);
        // Si el refresh token es inválido, limpiar todo
        clearTokens();
        return null;
      }

      // Guardar los nuevos tokens
      saveToken(data.data.token);
      saveRefreshToken(data.data.refreshToken);

      return data.data;
    } catch (error) {
      return null;
    }
  },
};
