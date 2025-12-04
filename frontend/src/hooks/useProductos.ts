import { useState, useEffect, useMemo } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient<ApiResponse>("/productos");
        
        // Solo productos activos
        const productosActivos = response.data.filter((p) => p.activo);
        setProductos(productosActivos);
      } catch (err) {
        console.error("Error loading productos", err);
        setError("Error al cargar productos");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const searchProductos = (query: string): Producto[] => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(searchTerm) ||
        producto.descripcion?.toLowerCase().includes(searchTerm)
    );
  };

  return {
    productos,
    loading,
    error,
    searchProductos,
  };
}

