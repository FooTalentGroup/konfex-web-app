export type EstadoPresupuesto =
  | "BORRADOR"
  | "DESCARGADO"
  | "ACEPTADO"
  | "RECHAZADO"
  | "VENCIDO";

export interface BudgetDetailResponseDto {
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
  tarifaEnvio?: number | null;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetResponseDto {
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
  origen?: "telegram" | "manual";
  detalles: BudgetDetailResponseDto[];
  adicionales?: AdicionalResponseDto[];
  cliente?: {
    id: number;
    nombre: string;
    email: string | null;
    telefono?: string | null;
  } | null;
  pedido?: {
    id: number;
    estado: string;
  } | null;
}

export interface Budget {
  id: number;
  numeroPresupuesto: string;
  clienteNombre: string;
  totalFinal: number;
  fechaVencimiento: string | null;
  estado: string;
}
