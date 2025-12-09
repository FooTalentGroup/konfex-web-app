export interface CreateProductoDtoDB {
  codigo: number;
  coleccionId: number;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
  imagen?: string | null;
  tallas?: string[];
  colores?: string[];
  precio?: number | null;
  mermaCantidad?: number | null;
  mermaUnidad?: string | null;
  mermaPrecio?: number | null;
  tarifaCosto?: number | null;
  tarifaHoras?: number | null;
  materiales?: { materialId: number; cantidad: number }[];
}
