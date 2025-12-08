import type {
  Adicional,
  Cliente,
  GastosNegocio,
  Pedido,
  Presupuesto,
  PresupuestoDetalle,
} from "../../../generated/prisma/client";
import type { EstadoPresupuesto } from "./presupuesto.schema";
import type {
  AdicionalResponseDto,
  PresupuestoDetalleResponseDto,
  PresupuestoListItemDto,
  PresupuestoResponseDto,
} from "./presupuesto.types";

export const toPresupuestoDetalleResponseDto = (
  detalle: PresupuestoDetalle
): PresupuestoDetalleResponseDto => ({
  id: detalle.id,
  productoId: detalle.productoId,
  descripcion: detalle.descripcion,
  cantidad: detalle.cantidad,
  costoUnitario: detalle.costoUnitario,
});

export const toAdicionalResponseDto = (adicional: Adicional): AdicionalResponseDto => ({
  id: adicional.id,
  nombre: adicional.nombre,
  cantidad: adicional.cantidad,
  monto: adicional.monto,
  totalCosto: adicional.totalCosto,
  tarifaEnvio: adicional.tarifaEnvio ?? null,
  observaciones: adicional.observaciones,
  createdAt: adicional.createdAt.toISOString(),
  updatedAt: adicional.updatedAt.toISOString(),
});

export const toPresupuestoResponseDto = (
  presupuesto: Presupuesto & {
    detalles?: PresupuestoDetalle[];
    adicionales?: Adicional[];
    cliente?: Cliente | null;
    pedido?: Pedido | null;
    gastosNegocio?: GastosNegocio;
  }
): PresupuestoResponseDto => {
  if (!presupuesto.gastosNegocio) {
    throw new Error("gastosNegocio es requerido para calcular costosIndirectos");
  }

  const costosIndirectos = (presupuesto.gastosNegocio.porcentaje * presupuesto.totalCosto) / 100;

  return {
    id: presupuesto.id,
    numeroPresupuesto: presupuesto.numeroPresupuesto,
    nombre: presupuesto.nombre,
    clienteId: presupuesto.clienteId,
    fechaCreacion: presupuesto.fechaCreacion.toISOString(),
    fechaVencimiento: presupuesto.fechaVencimiento
      ? presupuesto.fechaVencimiento.toISOString()
      : null,
    estado: presupuesto.estado as EstadoPresupuesto,
    margenGananciaPorcentaje: presupuesto.margenGananciaPorcentaje,
    gastosIndirectosPorcentaje: presupuesto.gastosNegocio.porcentaje,
    totalCosto: presupuesto.totalCosto,
    costosIndirectos,
    ganancias: presupuesto.ganancias,
    iva: presupuesto.iva,
    totalFinal: presupuesto.totalFinal,
    notas: presupuesto.notas,

    detalles: presupuesto.detalles?.map(toPresupuestoDetalleResponseDto) ?? [],
    adicionales: presupuesto.adicionales?.map(toAdicionalResponseDto) ?? [],

    cliente: presupuesto.cliente
      ? {
          id: presupuesto.cliente.id,
          nombre: presupuesto.cliente.nombre,
          email: presupuesto.cliente.email,
        }
      : null,

    pedido: presupuesto.pedido
      ? {
          id: presupuesto.pedido.id,
          estado: presupuesto.pedido.estado,
        }
      : null,
  };
};

export const toPresupuestoListResponseDto = (
  items: (Presupuesto & {
    detalles?: PresupuestoDetalle[];
    adicionales?: Adicional[];
    cliente?: Cliente | null;
    pedido?: Pedido | null;
    gastosNegocio?: GastosNegocio;
  })[]
): PresupuestoListItemDto[] => items.map(toPresupuestoResponseDto);
