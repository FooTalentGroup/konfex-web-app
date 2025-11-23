import {
  Presupuesto,
  PresupuestoDetalle,
  Cliente,
  Pedido,
} from "@prisma/client";

import {
  PresupuestoResponseDto,
  PresupuestoDetalleResponseDto,
  PresupuestoListItemDto,
} from "./presupuesto.types";
import { EstadoPresupuesto } from "./presupuesto.schema";

export const toPresupuestoDetalleResponseDto = (
  detalle: PresupuestoDetalle
): PresupuestoDetalleResponseDto => ({
  id: detalle.id,
  productoId: detalle.productoId,
  descripcion: detalle.descripcion,
  cantidad: detalle.cantidad,
  costoUnitario: detalle.costoUnitario,
});

export const toPresupuestoResponseDto = (
  presupuesto: Presupuesto & {
    detalles?: PresupuestoDetalle[];
    cliente?: Cliente | null;
    pedido?: Pedido | null;
  }
): PresupuestoResponseDto => ({
  id: presupuesto.id,
  numeroPresupuesto: presupuesto.numeroPresupuesto,
  clienteId: presupuesto.clienteId,
  fechaCreacion: presupuesto.fechaCreacion.toISOString(),
  fechaVencimiento: presupuesto.fechaVencimiento
    ? presupuesto.fechaVencimiento.toISOString()
    : null,
  estado: presupuesto.estado as EstadoPresupuesto,
  margenGananciaPorcentaje: presupuesto.margenGananciaPorcentaje,
  gastosIndirectosPorcentaje: presupuesto.gastosIndirectosPorcentaje,
  totalCosto: presupuesto.totalCosto,
  totalVenta: presupuesto.totalVenta,
  notas: presupuesto.notas,

  detalles: presupuesto.detalles?.map(toPresupuestoDetalleResponseDto) ?? [],

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
});

export const toPresupuestoListResponseDto = (
  items: (Presupuesto & {
    detalles?: PresupuestoDetalle[];
    cliente?: Cliente | null;
    pedido?: Pedido | null;
  })[]
): PresupuestoListItemDto[] => items.map(toPresupuestoResponseDto);
