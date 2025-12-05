export interface CreateProductoDtoDB {
    codigo: number; // ⚠ obligatorio
    coleccionId: number; // ⚠ obligatorio
    nombre: string;
    descripcion?: string | null;
    activo?: boolean;
    tallas?: string[];
    colores?: string[];
  }