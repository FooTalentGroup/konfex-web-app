import { PresupuestoResponseDto } from '@/types/presupuesto.types';
import { ApiResponse } from '@/types/auth.types';

export const presupuestoService = {
  getAll: async (): Promise<PresupuestoResponseDto[]> => {
    const response = await fetch('/api/v1/presupuestos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: ApiResponse<PresupuestoResponseDto[]> = await response.json();
        const errorMessage = data.message || 'Error al obtener presupuestos';
        const errors = data.errors || [];
        throw new Error(errors.length > 0 ? errors.join(', ') : errorMessage);
      }
      
      const text = await response.text();
      if (response.status === 404) {
        throw new Error('Ruta no encontrada. Verifica que el backend esté corriendo.');
      }
      throw new Error(`Error del servidor (${response.status}): ${text.substring(0, 100)}`);
    }

    const data: ApiResponse<PresupuestoResponseDto[]> = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Error al obtener presupuestos');
    }

    return data.data;
  },
};

