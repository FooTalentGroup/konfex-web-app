import { EstadoPresupuesto } from "./presupuesto.schema";

export interface PresupuestoDetalleResponseDto {
  id: number;
  productoId: number;
  descripcion?: string | null;
  cantidad: number;
  costoUnitario: number;
}

export interface PresupuestoResponseDto {
  id: number;
  numeroPresupuesto: number;
  clienteId: number | null;
  fechaCreacion: string;
  fechaVencimiento: string | null;
  estado: EstadoPresupuesto;
  margenGananciaPorcentaje: number;
  gastosIndirectosPorcentaje: number;
  totalCosto: number;
  totalVenta: number;
  notas: string | null;
  detalles: PresupuestoDetalleResponseDto[];
  cliente?: {
    id: number;
    nombre: string;
    email: string | null;
  } | null;
  pedido?: {
    id: number;
    estado: string;
  } | null;
}

export type PresupuestoListItemDto = PresupuestoResponseDto;
