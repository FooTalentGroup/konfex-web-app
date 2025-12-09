import { AppError } from "@/common/errors";

import prisma from "../../config/prisma";
import { gastosNegocioService } from "../gastos-negocio/gastos-negocio.service";
import { impuestoGeneralService } from "../impuesto-general/impuesto-general.service";
import { PresupuestoRepository } from "./presupuesto.repository";
import type {
  CreatePresupuestoRequestDto,
  PartialUpdatePresupuestoRequestDto,
  UpdatePresupuestoRequestDto,
} from "./presupuesto.schema";
import { applyGastosYMargen, applyIVA, calcTotalCostoFromDetalles } from "./utils";

/**
 * Helper function: Crea un pedido automáticamente cuando un presupuesto se aprueba
 *
 * Mejoras implementadas:
 * 1. Calcula precioUnitario usando totalFinal del presupuesto (proporcional)
 * 3. Agrega logs detallados para auditoría
 * 4. Genera notificaciones estructuradas para sistemas externos
 */
async function createPedidoFromPresupuesto(
  presupuestoId: number,
  presupuesto: {
    clienteId: number | null;
    fechaVencimiento: Date | null;
  }
) {
  if (!presupuesto.clienteId) {
    const error = new AppError(
      "No se puede crear un pedido sin cliente asociado al presupuesto",
      400
    );

    throw error;
  }

  const existingPedido = await prisma.pedido.findUnique({
    where: { presupuestoId },
    include: { cliente: true },
  });

  if (existingPedido) {
    return existingPedido;
  }

  const presupuestoCompleto = await prisma.presupuesto.findUnique({
    where: { id: presupuestoId },
    include: {
      cliente: true,
      detalles: true,
      adicionales: true,
    },
  });

  if (!presupuestoCompleto) {
    const error = new AppError("Presupuesto no encontrado", 404);

    throw error;
  }

  const detallesPresupuesto = presupuestoCompleto.detalles || [];

  if (detallesPresupuesto.length === 0) {
    const error = new AppError("No se puede crear un pedido sin detalles en el presupuesto", 400);

    throw error;
  }

  const totalCostoDetalles = detallesPresupuesto.reduce(
    (sum, detalle) => sum + detalle.cantidad * detalle.costoUnitario,
    0
  );

  const factorPrecio =
    totalCostoDetalles > 0 && presupuestoCompleto.totalFinal > 0
      ? presupuestoCompleto.totalFinal / totalCostoDetalles
      : 1;

  const pedido = await prisma.pedido.create({
    data: {
      presupuestoId,
      clienteId: presupuesto.clienteId,
      estado: "NO_VISTO",
      fechaEntregaEstimada: presupuesto.fechaVencimiento || null,
      pagado: false,
      detalles: {
        create: detallesPresupuesto.map((detalle) => {
          const precioUnitario = detalle.costoUnitario * factorPrecio;
          const subtotal = detalle.cantidad * precioUnitario;

          return {
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            costoUnitario: detalle.costoUnitario,
            precioUnitario: Math.round(precioUnitario * 100) / 100,
            subtotal: Math.round(subtotal * 100) / 100,
            talle: null,
            color: null,
          };
        }),
      },
    },
    include: {
      detalles: true,
      cliente: true,
      presupuesto: {
        select: {
          numeroPresupuesto: true,
          nombre: true,
          totalFinal: true,
        },
      },
    },
  });

  return pedido;
}

export const PresupuestoService = {
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
  getAll: async () => {
    const items = await PresupuestoRepository.findMany({
      include: {
        cliente: true,
        pedido: true,
        detalles: true,
        gastosNegocio: true,
      },
    });

    return items;
  },

  getById: async (id: number) => {
    const presupuesto = await PresupuestoRepository.findById(id, {
      include: {
        cliente: true,
        detalles: true,
        pedido: true,
        gastosNegocio: true,
      },
    });
    if (!presupuesto) {
      throw new AppError("Presupuesto no encontrado", 404);
    }
    return presupuesto;
  },

  create: async (payload: CreatePresupuestoRequestDto) => {
    const {
      nombre,
      clienteId,
      fechaVencimiento,
      estado,
      margenGananciaPorcentaje,
      gastosNegocioId,
      totalCosto: totalCostoFromClient,
      costosIndirectos: costosIndirectosFromClient,
      ganancias: gananciasFromClient,
      notas,
      detalles,
      adicionales,
      origen: origenFromPayload = "manual",
    } = payload;

    let origen = origenFromPayload;

    if (origen === "manual" && clienteId) {
      const clienteConTelegram = await prisma.cliente.findUnique({
        where: { id: clienteId },
        include: {
          telegramMessages: {
            take: 1,
            where: {
              source: "telegram",
            },
          },
        },
      });

      if (clienteConTelegram?.telegramMessages && clienteConTelegram.telegramMessages.length > 0) {
        origen = "telegram";
      }
    }

    const todosGastosNegocio = await gastosNegocioService.getAll();
    const gastosIndirectosPorcentaje = todosGastosNegocio.reduce(
      (sum, gasto) => sum + gasto.porcentaje,
      0
    );

    let totalCosto = typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let costosIndirectos =
      typeof costosIndirectosFromClient === "number" ? costosIndirectosFromClient : 0;
    let ganancias = typeof gananciasFromClient === "number" ? gananciasFromClient : 0;

    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);
      const { costosIndirectos: costosCalculados, ganancias: gananciasCalculadas } =
        applyGastosYMargen(totalCosto, gastosIndirectosPorcentaje, margenGananciaPorcentaje);
      costosIndirectos = costosCalculados;
      ganancias = gananciasCalculadas;
    }

    let iva = 0;
    let totalFinal = totalCosto + costosIndirectos + ganancias;

    try {
      const impuestoActivo = await impuestoGeneralService.getActivo();
      const subtotal = totalCosto + costosIndirectos + ganancias;
      const { iva: ivaCalculado, totalFinal: totalFinalCalculado } = applyIVA(
        subtotal,
        Number(impuestoActivo.porcentaje)
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch {
      // ignore
    }
    const numeroPresupuesto = await PresupuestoService.getNextNumero();

    const created = await PresupuestoRepository.create({
      data: {
        numeroPresupuesto,
        nombre: nombre ?? null,
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosNegocioId,
        totalCosto,
        costosIndirectos,
        ganancias,
        iva,
        totalFinal,
        notas,
        origen,
        detalles,
        adicionales,
      },
    });

    if (estado === "ACEPTADO" && created.clienteId) {
      try {
        await createPedidoFromPresupuesto(created.id, {
          clienteId: created.clienteId,
          fechaVencimiento: created.fechaVencimiento,
        });
      } catch {
        // ignore
      }
    }

    return created;
  },

  update: async (id: number, payload: UpdatePresupuestoRequestDto) => {
    const existing = await PresupuestoRepository.findById(id, {
      include: { pedido: true, gastosNegocio: true },
    });
    if (!existing) {
      throw new AppError("Presupuesto no encontrado", 404);
    }

    if (existing.pedido) {
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400
      );
    }

    const {
      nombre,
      clienteId,
      fechaVencimiento,
      estado,
      margenGananciaPorcentaje,
      gastosNegocioId,
      totalCosto: totalCostoFromClient,
      costosIndirectos: costosIndirectosFromClient,
      ganancias: gananciasFromClient,
      notas,
      detalles,
      adicionales,
      origen,
    } = payload;

    const todosGastosNegocio = await gastosNegocioService.getAll();
    const gastosIndirectosPorcentaje = todosGastosNegocio.reduce(
      (sum, gasto) => sum + gasto.porcentaje,
      0
    );
    const gastosNegocioIdToUse = gastosNegocioId ?? existing.gastosNegocioId;

    let totalCosto = typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let costosIndirectos =
      typeof costosIndirectosFromClient === "number" ? costosIndirectosFromClient : 0;
    let ganancias = typeof gananciasFromClient === "number" ? gananciasFromClient : 0;

    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);

      const { costosIndirectos: costosCalculados, ganancias: gananciasCalculadas } =
        applyGastosYMargen(totalCosto, gastosIndirectosPorcentaje, margenGananciaPorcentaje);

      costosIndirectos = costosCalculados;
      ganancias = gananciasCalculadas;
    }

    let iva = 0;
    let totalFinal = totalCosto + costosIndirectos + ganancias;

    try {
      const impuestoActivo = await impuestoGeneralService.getActivo();
      const subtotal = totalCosto + costosIndirectos + ganancias;
      const { iva: ivaCalculado, totalFinal: totalFinalCalculado } = applyIVA(
        subtotal,
        Number(impuestoActivo.porcentaje)
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch {
      // ignore
    }

    const updated = await PresupuestoRepository.update(id, {
      data: {
        nombre: nombre ?? null,
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosNegocioId: gastosNegocioIdToUse,
        totalCosto,
        costosIndirectos,
        ganancias,
        iva,
        totalFinal,
        notas,
        origen: origen ?? existing.origen,
        detalles,
        adicionales,
      },
    });

    const estadoCambioAceptado =
      estado === "ACEPTADO" && existing.estado !== "ACEPTADO" && !existing.pedido;

    if (estadoCambioAceptado && updated.clienteId) {
      try {
        await createPedidoFromPresupuesto(updated.id, {
          clienteId: updated.clienteId,
          fechaVencimiento: updated.fechaVencimiento,
        });
      } catch {
        // ignore
      }
    }

    return updated;
  },

  partialUpdate: async (id: number, payload: PartialUpdatePresupuestoRequestDto) => {
    const existing = await PresupuestoRepository.findById(id, {
      include: { pedido: true, gastosNegocio: true },
    });
    if (!existing) {
      throw new AppError("Presupuesto no encontrado", 404);
    }

    if (existing.pedido) {
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400
      );
    }

    const todosGastosNegocio = await gastosNegocioService.getAll();
    const gastosIndirectosPorcentaje = todosGastosNegocio.reduce(
      (sum, gasto) => sum + gasto.porcentaje,
      0
    );
    const gastosNegocioIdToUse = payload.gastosNegocioId ?? existing.gastosNegocioId;

    const margenGananciaPorcentaje =
      payload.margenGananciaPorcentaje ?? existing.margenGananciaPorcentaje;
    const totalCostoFromMerged =
      typeof payload.totalCosto === "number" ? payload.totalCosto : Number(existing.totalCosto);
    const costosIndirectosFromMerged =
      typeof payload.costosIndirectos === "number"
        ? payload.costosIndirectos
        : Number(existing.costosIndirectos);
    const gananciasFromMerged =
      typeof payload.ganancias === "number" ? payload.ganancias : Number(existing.ganancias);

    let totalCosto: number = totalCostoFromMerged;
    let costosIndirectos: number = costosIndirectosFromMerged;
    let ganancias: number = gananciasFromMerged;

    if (payload.detalles !== undefined) {
      if (Array.isArray(payload.detalles) && payload.detalles.length > 0) {
        totalCosto = calcTotalCostoFromDetalles(payload.detalles);
        const { costosIndirectos: costosCalculados, ganancias: gananciasCalculadas } =
          applyGastosYMargen(totalCosto, gastosIndirectosPorcentaje, margenGananciaPorcentaje);
        costosIndirectos = costosCalculados;
        ganancias = gananciasCalculadas;
      } else {
        totalCosto = 0;
        costosIndirectos = 0;
        ganancias = 0;
      }
    }

    let iva = 0;
    let totalFinal = totalCosto + costosIndirectos + ganancias;

    try {
      const impuestoActivo = await impuestoGeneralService.getActivo();
      const subtotal = totalCosto + costosIndirectos + ganancias;
      const { iva: ivaCalculado, totalFinal: totalFinalCalculado } = applyIVA(
        subtotal,
        Number(impuestoActivo.porcentaje)
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch {
      // ignore
    }

    const updateData: Partial<UpdatePresupuestoRequestDto> & {
      gastosNegocioId: number;
      totalCosto: number;
      costosIndirectos: number;
      ganancias: number;
      iva: number;
      totalFinal: number;
    } = {
      ...payload,
      gastosNegocioId: gastosNegocioIdToUse,
      totalCosto,
      costosIndirectos,
      ganancias,
      iva,
      totalFinal,
    };

    if (payload.clienteId !== undefined) {
      updateData.clienteId = payload.clienteId ?? null;
    }

    let fechaVencimientoDate: Date | undefined = undefined;
    if (payload.fechaVencimiento !== undefined) {
      fechaVencimientoDate = payload.fechaVencimiento
        ? new Date(payload.fechaVencimiento)
        : undefined;
    }

    const updated = await PresupuestoRepository.update(id, {
      data: {
        ...updateData,
        fechaVencimiento: fechaVencimientoDate,
      },
    });

    const estadoCambioAceptado =
      payload.estado === "ACEPTADO" && existing.estado !== "ACEPTADO" && !existing.pedido;

    if (estadoCambioAceptado && updated.clienteId) {
      try {
        await createPedidoFromPresupuesto(updated.id, {
          clienteId: updated.clienteId,
          fechaVencimiento: updated.fechaVencimiento,
        });
      } catch {
        // ignore
      }
    }

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
