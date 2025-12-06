import { apiClient } from '@/config/apiClient';
import { ApiResponse } from '@/types/auth.types';

export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  origen?: string | null;
  instagramUser?: string | null;
  notas?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteDto {
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  origen?: string;
  instagramUser?: string;
  notas?: string;
}

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await apiClient<ApiResponse<Cliente[]>>('/clientes');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener clientes');
    }

    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await apiClient<ApiResponse<Cliente>>(`/clientes/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener cliente');
    }

    return response.data;
  },

  findByName: async (nombre: string): Promise<Cliente | null> => {
    try {
      const clientes = await clienteService.getAll();
      return clientes.find(c => c.nombre.toLowerCase() === nombre.toLowerCase()) || null;
    } catch (error) {
      console.error('Error al buscar cliente por nombre:', error);
      return null;
    }
  },

  create: async (data: CreateClienteDto): Promise<Cliente> => {
    const response = await apiClient<ApiResponse<Cliente>>(
      '/clientes',
      {
        method: 'POST',
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al crear cliente');
    }

    return response.data;
  },

  /**
   * Busca un cliente por nombre o lo crea si no existe
   */
  findOrCreate: async (
    nombre: string,
    additionalData?: { email?: string; telefono?: string }
  ): Promise<Cliente> => {
    // Primero intentar buscar
    const existing = await clienteService.findByName(nombre);
    
    if (existing) {
      return existing;
    }

    // Si no existe, crear uno nuevo
    return await clienteService.create({
      nombre,
      email: additionalData?.email,
      telefono: additionalData?.telefono,
    });
  },

  update: async (id: number, data: Partial<CreateClienteDto>): Promise<Cliente> => {
    const response = await apiClient<ApiResponse<Cliente>>(
      `/clientes/${id}`,
      {
        method: 'PUT',
        body: data,
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al actualizar cliente');
    }

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient<ApiResponse<null>>(
      `/clientes/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar cliente');
    }
  },
};

