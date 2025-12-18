import { apiClient } from '@/config/apiClient';
import { ApiResponse } from '@/types/auth.types';

export interface Client {
  id: number;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  numeroIdentificacion?: string | null;
  origen?: string | null;
  instagramUser?: string | null;
  notas?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  numeroIdentificacion?: string;
  origen?: string;
  instagramUser?: string;
  notas?: string;
}

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await apiClient<ApiResponse<Client[]>>('/clients');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener clientes');
    }

    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient<ApiResponse<Client>>(`/clients/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al obtener cliente');
    }

    return response.data;
  },

  findByName: async (nombre: string): Promise<Client | null> => {
    try {
      const clients = await clientService.getAll();
      return clients.find(c => c.nombre.toLowerCase() === nombre.toLowerCase()) || null;
    } catch (error) {
      return null;
    }
  },

  create: async (data: CreateClientDto): Promise<Client> => {
    const response = await apiClient<ApiResponse<Client>>(
      '/clients',
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
  ): Promise<Client> => {
    // Primero intentar buscar
    const existing = await clientService.findByName(nombre);
    
    if (existing) {
      return existing;
    }

    // Si no existe, crear uno nuevo
    return await clientService.create({
      nombre,
      email: additionalData?.email,
      telefono: additionalData?.telefono,
    });
  },

  update: async (id: number, data: Partial<CreateClientDto>): Promise<Client> => {
    const response = await apiClient<ApiResponse<Client>>(
      `/clients/${id}`,
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
      `/clients/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar cliente');
    }
  },
};

