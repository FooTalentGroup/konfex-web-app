import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";

interface GastosNegocio {
  id: number;
  nombre: string;
  porcentaje: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: GastosNegocio[];
}

export function useGastosNegocio() {
  const [gastosNegocio, setGastosNegocio] = useState<GastosNegocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGastosNegocio = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient<ApiResponse>("/gastos-negocio");
        setGastosNegocio(response.data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar gastos de negocio";
        setError(errorMessage);
        console.error("Error loading gastos negocio", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGastosNegocio();
  }, []);

  return { gastosNegocio, loading, error };
}

