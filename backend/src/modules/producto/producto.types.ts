export interface CreateProductoDtoDB {
  codigo: number; // ⚠ obligatorio
  coleccionId: number; // ⚠ obligatorio
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
  imagen?: string | null;
  tallas?: string[];
  colores?: string[];
  mermaCantidad?: number | null;
  mermaUnidad?: string | null;
  mermaPrecio?: number | null;
  tarifaCosto?: number | null;
  tarifaHoras?: number | null;
  precio?: number | null;
  materiales?: {
    materialId: number;
    cantidad: number;
  }[];
}
