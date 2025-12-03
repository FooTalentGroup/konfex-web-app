import {
  Presupuesto,
  PresupuestoDetalle,
  Cliente,
  Pedido,
  Adicional,
} from "@prisma/client";

import {
  PresupuestoResponseDto,
  PresupuestoDetalleResponseDto,
  PresupuestoListItemDto,
  AdicionalResponseDto,
} from "./presupuesto.types";
import { EstadoPresupuesto } from "./presupuesto.schema";

export const toPresupuestoDetalleResponseDto = (
  detalle: PresupuestoDetalle,
): PresupuestoDetalleResponseDto => ({
  id: detalle.id,
  productoId: detalle.productoId,
  descripcion: detalle.descripcion,
  cantidad: detalle.cantidad,
  costoUnitario: detalle.costoUnitario,
});

export const toAdicionalResponseDto = (
  adicional: Adicional,
): AdicionalResponseDto => ({
  id: adicional.id,
  nombre: adicional.nombre,
  cantidad: adicional.cantidad,
  monto: adicional.monto,
  totalCosto: adicional.totalCosto,
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
  },
): PresupuestoResponseDto => ({
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
  gastosIndirectosPorcentaje: presupuesto.gastosIndirectosPorcentaje,
  totalCosto: presupuesto.totalCosto,
  costosIndirectos: presupuesto.costosIndirectos,
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
});

export const toPresupuestoListResponseDto = (
  items: (Presupuesto & {
    detalles?: PresupuestoDetalle[];
    adicionales?: Adicional[];
    cliente?: Cliente | null;
    pedido?: Pedido | null;
  })[],
): PresupuestoListItemDto[] => items.map(toPresupuestoResponseDto);
