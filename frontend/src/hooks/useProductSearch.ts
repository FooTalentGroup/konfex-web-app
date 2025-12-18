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

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Product[];
}

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

            resolve(response.data || []);
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
