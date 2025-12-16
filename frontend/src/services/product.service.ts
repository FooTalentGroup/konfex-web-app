import { API_CONFIG } from "@/config/api.config";
import {
  ProductsAPIResponse,
  Product,
  ProductAPI,
  CreateProductRequest,
} from "@/types/IProduct";

export const productService = {
  getAll: async (): Promise<ProductAPI[]> => {
    const url = API_CONFIG.getApiUrl("/productos");

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const result: ProductsAPIResponse = await response.json();
      return result.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  },

  getByCollection: async (collectionId: number): Promise<ProductAPI[]> => {
    const url = API_CONFIG.getApiUrl(`/products?coleccionId=${collectionId}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: ProductsAPIResponse = await response.json();

      return result.data.filter(
        (product) => product.coleccionId === collectionId
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al obtener productos de la colección";
      throw new Error(errorMessage);
    }
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const url = API_CONFIG.getApiUrl("/productos");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  },
};
