import { EstadoPresupuesto } from "./presupuesto.schema";

export interface PresupuestoDetalleResponseDto {
  id: number;
  productoId: number;
  descripcion?: string | null;
  cantidad: number;
  costoUnitario: number;
}

export interface AdicionalResponseDto {
  id: number;
  nombre: string;
  cantidad: number;
  monto: number;
  totalCosto: number;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PresupuestoResponseDto {
  id: number;
  numeroPresupuesto: number;
  nombre?: string | null;
  clienteId: number | null;
  fechaCreacion: string;
  fechaVencimiento: string | null;
  estado: EstadoPresupuesto;
  margenGananciaPorcentaje: number;
  gastosIndirectosPorcentaje: number;
  totalCosto: number;
  costosIndirectos: number;
  ganancias: number;
  iva: number;
  totalFinal: number;
  notas: string | null;
  detalles: PresupuestoDetalleResponseDto[];
  adicionales: AdicionalResponseDto[];
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
