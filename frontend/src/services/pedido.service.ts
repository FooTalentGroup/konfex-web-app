import { apiClient } from '@/config/apiClient';
import { ApiResponse } from '@/types/auth.types';

export interface PedidoDetalle {
  id: number;
  productoId: number;
  cantidad: number;
  talle?: string | null;
  color?: string | null;
  costoUnitario: number;
  precioUnitario: number;
  subtotal: number;
  producto: {
    id: number;
    nombre: string;
    codigo: number;
  };
}

export interface Pedido {
  id: number;
  presupuestoId: number;
  clienteId: number;
  fechaCreacion: string;
  estado: 'NO_VISTO' | 'EN_COMPRA' | 'EN_PRODUCCION' | 'ENTREGADO';
  pagado: boolean;
  fechaEntregaEstimada?: string | null;
  fechaEntregaReal?: string | null;
  createdAt: string;
  updatedAt: string;
  cliente: {
    id: number;
    nombre: string;
    telefono?: string | null;
    email?: string | null;
  };
  presupuesto: {
    id: number;
    numeroPresupuesto: number;
    nombre: string;
    totalFinal: number;
  };
  detalles: PedidoDetalle[];
  etapas?: Array<{
    id: number;
    etapa: string;
    fechaInicio: string;
    fechaFin?: string | null;
    responsable?: string | null;
  }>;
  telegramChatId?: string | null;
}

export interface UpdatePedidoDto {
  estado?: 'NO_VISTO' | 'EN_COMPRA' | 'EN_PRODUCCION' | 'ENTREGADO';
  pagado?: boolean;
  fechaEntregaEstimada?: string | null;
  fechaEntregaReal?: string | null;
}

export const pedidoService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await apiClient<ApiResponse<Pedido[]>>('/pedidos');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener pedidos');
    }

    return response.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const response = await apiClient<ApiResponse<Pedido>>(`/pedidos/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener pedido');
    }

    return response.data;
  },

  update: async (id: number, data: UpdatePedidoDto): Promise<Pedido> => {
    const response = await apiClient<ApiResponse<Pedido>>(
      `/pedidos/${id}`,
      {
        method: 'PATCH',
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al actualizar pedido');
    }

    return response.data;
  },
};

