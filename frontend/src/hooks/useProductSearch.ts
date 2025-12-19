import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "@/config/apiClient";

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
  sizes: string[];
  colors: string[];
  price?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductAPI {
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
  data: ProductAPI[];
}

const mapProductoToProduct = (product: ProductAPI): Product => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion,
  active: product.activo,
  sizes: product.tallas || [],
  colors: product.colores || [],
  price: product.precio,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
})

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchProducts = useCallback(
    async (query: string): Promise<Product[]> => {
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
              `/products/search?search=${searchQuery}&limit=10`
            );

            const mappedProducts = (response.data || []).map(mapProductoToProduct);
            setProducts(mappedProducts);
            resolve(mappedProducts);
          } catch (err) {
            setError("Error searching products");
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
    products,
    loading,
    error,
    searchProducts,
  };
}
