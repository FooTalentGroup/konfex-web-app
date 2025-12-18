import { BudgetResponseDto } from "@/types/budget.types";
import { ApiResponse } from "@/types/auth.types";
import { apiClient } from "@/config/apiClient";

export interface CreateBudgetDto {
  nombre?: string;
  clienteId?: number | null;
  fechaVencimiento?: string;
  estado: "BORRADOR" | "DESCARGADO" | "ACEPTADO" | "RECHAZADO" | "VENCIDO";
  margenGananciaPorcentaje: number;
  gastosNegocioId: number;
  totalCosto: number;
  costosIndirectos: number;
  ganancias: number;
  notas?: string;
  origen?: "telegram" | "manual";
  detalles?: Array<{
    productoId: number;
    descripcion?: string;
    cantidad: number;
    costoUnitario: number;
  }>;
  adicionales?: Array<{
    nombre: string;
    cantidad: number;
    monto: number;
    totalCosto: number;
    tarifaEnvio?: number;
    observaciones?: string;
  }>;
}

export const budgetService = {
  getAll: async (): Promise<BudgetResponseDto[]> => {
    const response = await apiClient<ApiResponse<BudgetResponseDto[]>>(
      "/budgets"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al obtener presupuestos");
    }

    return response.data;
  },

  getById: async (id: number): Promise<BudgetResponseDto> => {
    const response = await apiClient<ApiResponse<BudgetResponseDto>>(
      `/budgets/${id}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al obtener presupuesto");
    }

    return response.data;
  },

  create: async (
    data: CreateBudgetDto
  ): Promise<BudgetResponseDto> => {
    const response = await apiClient<ApiResponse<BudgetResponseDto>>(
      "/budgets",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al crear presupuesto");
    }

    return response.data;
  },

  update: async (
    id: number,
    data: CreateBudgetDto
  ): Promise<BudgetResponseDto> => {
    const response = await apiClient<ApiResponse<BudgetResponseDto>>(
      `/budgets/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al actualizar presupuesto");
    }

    return response.data;
  },

  partialUpdate: async (
    id: number,
    data: Partial<CreateBudgetDto>
  ): Promise<BudgetResponseDto> => {
    const response = await apiClient<ApiResponse<BudgetResponseDto>>(
      `/budgets/${id}`,
      {
        method: "PATCH",
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Error al actualizar presupuesto");
    }

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient<ApiResponse<null>>(`/budgets/${id}`, {
      method: "DELETE",
    });

    if (!response.success) {
      throw new Error(response.message || "Error al eliminar presupuesto");
    }
  },
};
