import { apiClient } from '@/config/apiClient';
import { ApiResponse } from '@/types/auth.types';

export interface OrderDetail {
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

export interface Order {
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
  detalles: OrderDetail[];
  etapas?: Array<{
    id: number;
    etapa: string;
    fechaInicio: string;
    fechaFin?: string | null;
    responsable?: string | null;
  }>;
  telegramChatId?: string | null;
}

export interface UpdateOrderDto {
  estado?: 'NO_VISTO' | 'EN_COMPRA' | 'EN_PRODUCCION' | 'ENTREGADO';
  pagado?: boolean;
  fechaEntregaEstimada?: string | null;
  fechaEntregaReal?: string | null;
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient<ApiResponse<Order[]>>('/orders');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener pedidos');
    }

    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient<ApiResponse<Order>>(`/orders/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener pedido');
    }

    return response.data;
  },

  update: async (id: number, data: UpdateOrderDto): Promise<Order> => {
    const response = await apiClient<ApiResponse<Order>>(
      `/orders/${id}`,
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

