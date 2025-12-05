import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/config/apiClient";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  tallas: string[];
  colores: string[];
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

  const searchProductos = useCallback(async (query: string): Promise<Producto[]> => {
    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Si el query está vacío, retornar array vacío
    if (!query || query.trim().length < 2) {
      return [];
    }

    return new Promise((resolve) => {
      // Debounce: esperar 300ms antes de hacer la búsqueda
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
          console.error("Error searching productos", err);
          setError("Error al buscar productos");
          resolve([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    });
  }, []);

  // Limpiar timeout al desmontar
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

