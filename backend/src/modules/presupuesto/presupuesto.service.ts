// presupuesto.service.ts
import { AppError } from "@/common/errors";

import { PresupuestoRepository } from "./presupuesto.repository";
import type {
  CreatePresupuestoRequestDto,
  PartialUpdatePresupuestoRequestDto,
  UpdatePresupuestoRequestDto,
} from "./presupuesto.schema";
import { applyGastosYMargen, calcTotalCostoFromDetalles } from "./utils";

export const PresupuestoService = {
  // Trae el número del siguiente presupuesto a generar
  getNextNumero: async (): Promise<number> => {
    const lastPresupuesto = await PresupuestoRepository.findMany({
      orderBy: { numeroPresupuesto: "desc" },
      take: 1,
    });

    if (lastPresupuesto.length === 0 || !lastPresupuesto[0].numeroPresupuesto) {
      return 1;
    }

    return lastPresupuesto[0].numeroPresupuesto + 1;
  },
  //trae todos los presupuestos
  getAll: async () => {
    const items = await PresupuestoRepository.findMany({
      include: {
        cliente: true,
        pedido: true,
        detalles: true,
      },
    });

    return items;
  },

  //trae un presupuesto por su id
  getById: async (id: number) => {
    const presupuesto = await PresupuestoRepository.findById(id, {
      include: { cliente: true, detalles: true, pedido: true },
    });
    if (!presupuesto) {
      throw new AppError("Presupuesto no encontrado", 404);
    }
    return presupuesto;
  },

  //crea un presupuesto
  create: async (payload: CreatePresupuestoRequestDto) => {
    const {
      clienteId,
      fechaVencimiento,
      estado,
      margenGananciaPorcentaje,
      gastosIndirectosPorcentaje,
      totalCosto: totalCostoFromClient,
      totalVenta: totalVentaFromClient,
      notas,
      detalles,
    } = payload;

    let totalCosto = typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let totalVenta = typeof totalVentaFromClient === "number" ? totalVentaFromClient : 0;

    // Si vienen detalles, calculamos totales desde los detalles
    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);
      const { totalVenta: ventaCalculada } = applyGastosYMargen(
        totalCosto,
        gastosIndirectosPorcentaje,
        margenGananciaPorcentaje
      );
      totalVenta = ventaCalculada;
    }

    // Generar número
    const numeroPresupuesto = await PresupuestoService.getNextNumero();

    const created = await PresupuestoRepository.create({
      data: {
        numeroPresupuesto,
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosIndirectosPorcentaje,
        totalCosto,
        totalVenta,
        notas,
        detalles,
      },
    });

    return created;
  },

  // Actualiza un presupuesto - todo el modelo
  update: async (id: number, payload: UpdatePresupuestoRequestDto) => {
    // Buscar el presupuesto con el pedido asociado
    const existing = await PresupuestoRepository.findById(id, {
      include: { pedido: true },
    });
    if (!existing) {
      throw new AppError("Presupuesto no encontrado", 404);
    }

    // REGLA DE NEGOCIO: si tiene pedido asociado, NO se puede modificar
    if (existing.pedido) {
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400
      );
    }

    const {
      clienteId,
      fechaVencimiento,
      estado,
      margenGananciaPorcentaje,
      gastosIndirectosPorcentaje,
      totalCosto: totalCostoFromClient,
      totalVenta: totalVentaFromClient,
      notas,
      detalles,
    } = payload;

    // Totales se inicializan en base a lo enviado por el cliente
    let totalCosto = typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let totalVenta = typeof totalVentaFromClient === "number" ? totalVentaFromClient : 0;

    // Si vienen detalles, recalculamos todo (regla de negocio)
    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);

      const { totalVenta: ventaCalculada } = applyGastosYMargen(
        totalCosto,
        gastosIndirectosPorcentaje,
        margenGananciaPorcentaje
      );

      totalVenta = ventaCalculada;
    }

    // Actualizar en DB
    const updated = await PresupuestoRepository.update(id, {
      data: {
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosIndirectosPorcentaje,
        totalCosto,
        totalVenta,
        notas,
        detalles,
      },
    });

    return updated;
  },

  // Actualiza parcialmente un presupuesto - solo la informacion que recibe
  partialUpdate: async (id: number, payload: PartialUpdatePresupuestoRequestDto) => {
    const existing = await PresupuestoRepository.findById(id, { include: { pedido: true } });
    if (!existing) {
      throw new AppError("Presupuesto no encontrado", 404);
    }

    if (existing.pedido) {
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400
      );
    }

    // Merge valores actuales con payload para cálculos
    const merged = {
      margenGananciaPorcentaje:
        payload.margenGananciaPorcentaje ?? existing.margenGananciaPorcentaje,
      gastosIndirectosPorcentaje:
        payload.gastosIndirectosPorcentaje ?? existing.gastosIndirectosPorcentaje,
      detalles: payload.detalles ?? existing.detalles,
      totalCosto: payload.totalCosto ?? existing.totalCosto,
      totalVenta: payload.totalVenta ?? existing.totalVenta,
    } as any;

    let totalCosto = merged.totalCosto;
    let totalVenta = merged.totalVenta;

    // recalcular totales
    if (payload.detalles !== undefined) {
      if (Array.isArray(payload.detalles) && payload.detalles.length > 0) {
        totalCosto = calcTotalCostoFromDetalles(payload.detalles);
        const { totalVenta: ventaCalculada } = applyGastosYMargen(
          Number(totalCosto) || 0,
          Number(merged.gastosIndirectosPorcentaje) || 0,
          Number(merged.margenGananciaPorcentaje) || 0
        );
        totalVenta = ventaCalculada;
      } else {
        // si el array esta vacío: totales en 0
        totalCosto = 0;
        totalVenta = 0;
      }
    }

    const updateData: any = {
      ...payload,
      totalCosto,
      totalVenta,
    };

    // Manejar clienteId: si viene undefined, no lo tocamos; si viene null, lo establecemos como null
    if (payload.clienteId !== undefined) {
      updateData.clienteId = payload.clienteId ?? null;
    }

    // Convertir fechaVencimiento si viene como string
    if (payload.fechaVencimiento !== undefined) {
      updateData.fechaVencimiento = payload.fechaVencimiento
        ? new Date(payload.fechaVencimiento)
        : null;
    }

    const updated = await PresupuestoRepository.update(id, {
      data: updateData,
    });

    return updated;
  },

  /**
   * Delete: por defecto hago delete físico. Si quieres soft-delete,
   * lo implementamos en el schema/model y cambiamos aquí.
   */
  delete: async (id: number) => {
    const existing = await PresupuestoRepository.findById(id);
    if (!existing) {
      throw new AppError("Presupuesto no encontrado", 404);
    }

    // Si hay pedido asociado, podríamos evitar borrado (regla opcional)
    if (existing.pedido) {
      throw new AppError(
        "No se puede eliminar un presupuesto que ya tiene un pedido asociado",
        400
      );
    }

    await PresupuestoRepository.delete(id);
    return true;
  },
};
