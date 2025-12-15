import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/config/apiClient";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  tallas: string[];
  colores: string[];
  precio?: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Producto[];
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchProductos = useCallback(
    async (query: string): Promise<Producto[]> => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!query || query.trim().length < 2) {
        return [];
      }

      return new Promise((resolve) => {
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            setLoading(true);
            setError(null);

            const searchQuery = encodeURIComponent(query.trim());
            const response = await apiClient<ApiResponse>(
              `/productos/search?search=${searchQuery}&limit=10`
            );

            resolve(response.data || []);
          } catch (err) {
            setError("Error al buscar productos");
            resolve([]);
          } finally {
            setLoading(false);
          }
        }, 300);
      });
    },
    []
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    productos,
    loading,
    error,
    searchProductos,
  };
}
