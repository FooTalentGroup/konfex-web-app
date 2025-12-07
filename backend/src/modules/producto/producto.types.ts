export interface CreateProductoDtoDB {
    codigo: number; // ⚠ obligatorio
    coleccionId: number; // ⚠ obligatorio
    nombre: string;
    descripcion?: string | null;
    activo?: boolean;
    imagen?: string | null;
    tallas?: string[];
    colores?: string[];
  }