import { PresupuestoResponseDto } from '@/types/presupuesto.types';
import { ApiResponse } from '@/types/auth.types';
import { apiClient } from '@/config/apiClient';

export interface CreatePresupuestoDto {
  nombre?: string;
  clienteId?: number | null;
  fechaVencimiento?: string;
  estado: "BORRADOR" | "ENVIADO" | "ACEPTADO" | "RECHAZADO" | "VENCIDO";
  margenGananciaPorcentaje: number;
  gastosNegocioId: number;
  totalCosto: number;
  costosIndirectos: number;
  ganancias: number;
  notas?: string;
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

export const presupuestoService = {
  getAll: async (): Promise<PresupuestoResponseDto[]> => {
    const response = await apiClient<ApiResponse<PresupuestoResponseDto[]>>('/presupuestos');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener presupuestos');
    }

    return response.data;
  },

  getById: async (id: number): Promise<PresupuestoResponseDto> => {
    const response = await apiClient<ApiResponse<PresupuestoResponseDto>>(`/presupuestos/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener presupuesto');
    }

    return response.data;
  },

  create: async (data: CreatePresupuestoDto): Promise<PresupuestoResponseDto> => {
    const response = await apiClient<ApiResponse<PresupuestoResponseDto>>(
      '/presupuestos',
      {
        method: 'POST',
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al crear presupuesto');
    }

    return response.data;
  },
};

