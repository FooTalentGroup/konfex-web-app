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

async function createPedidoFromPresupuesto(
  presupuestoId: number,
  presupuesto: {
    clienteId: number | null;
    fechaVencimiento: Date | null;
  }
) {
  const startTime = Date.now();

  console.log(
    `[PEDIDO_AUTO] Iniciando creación automática de pedido para presupuesto #${presupuestoId}`,
    {
      timestamp: new Date().toISOString(),
      presupuestoId,
      clienteId: presupuesto.clienteId,
    }
  );

  if (!presupuesto.clienteId) {
    const error = new AppError(
      "No se puede crear un pedido sin cliente asociado al presupuesto",
      400
    );
    console.error(`[PEDIDO_AUTO] Error de validación para presupuesto #${presupuestoId}:`, {
      error: error.message,
      presupuestoId,
    });
    throw error;
  }

  const existingPedido = await prisma.pedido.findUnique({
    where: { presupuestoId },
    include: { cliente: true },
  });

  if (existingPedido) {
    console.log(`[PEDIDO_AUTO] Pedido ya existe para presupuesto #${presupuestoId}`, {
      pedidoId: existingPedido.id,
      presupuestoId,
      estado: existingPedido.estado,
    });
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
    console.error(`[PEDIDO_AUTO] Error: Presupuesto #${presupuestoId} no encontrado`);
    throw error;
  }

  const detallesPresupuesto = presupuestoCompleto.detalles || [];

  if (detallesPresupuesto.length === 0) {
    const error = new AppError("No se puede crear un pedido sin detalles en el presupuesto", 400);
    console.error(`[PEDIDO_AUTO] Error: Presupuesto #${presupuestoId} sin detalles`);
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

  console.log(`[PEDIDO_AUTO] Cálculo de precios para presupuesto #${presupuestoId}`, {
    totalCostoDetalles,
    totalFinalPresupuesto: presupuestoCompleto.totalFinal,
    factorPrecio: factorPrecio.toFixed(4),
    cantidadDetalles: detallesPresupuesto.length,
  });

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

  const duration = Date.now() - startTime;
  const totalPedido = pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0);

  console.log(`[PEDIDO_AUTO] ✅ Pedido creado exitosamente`, {
    pedidoId: pedido.id,
    presupuestoId: pedido.presupuestoId,
    numeroPresupuesto: pedido.presupuesto?.numeroPresupuesto,
    clienteId: pedido.clienteId,
    clienteNombre: pedido.cliente?.nombre || "N/A",
    estado: pedido.estado,
    cantidadDetalles: pedido.detalles.length,
    totalPedido: totalPedido.toFixed(2),
    totalPresupuesto: presupuestoCompleto.totalFinal.toFixed(2),
    fechaEntregaEstimada: pedido.fechaEntregaEstimada?.toISOString() || null,
    duracionMs: duration,
    timestamp: new Date().toISOString(),
  });

  const notificacion = {
    tipo: "PEDIDO_CREADO_AUTOMATICAMENTE",
    nivel: "INFO",
    mensaje: `Pedido #${pedido.id} creado automáticamente desde presupuesto #${pedido.presupuesto?.numeroPresupuesto}`,
    datos: {
      pedidoId: pedido.id,
      presupuestoId: pedido.presupuestoId,
      numeroPresupuesto: pedido.presupuesto?.numeroPresupuesto,
      clienteId: pedido.clienteId,
      clienteNombre: pedido.cliente?.nombre,
      total: totalPedido,
      fechaCreacion: pedido.createdAt.toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  console.log(`[NOTIFICACION] ${notificacion.tipo}`, notificacion);

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
        console.log(
          `[PRESUPUESTO] Origen detectado automáticamente como "telegram" para cliente #${clienteId}`
        );
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
        impuestoActivo.porcentaje
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch (error) {
      console.warn("[PRESUPUESTO] No se pudo calcular IVA, usando valores sin impuesto", {
        error: error instanceof Error ? error.message : String(error),
        presupuestoId: "nuevo",
        totalCosto,
        costosIndirectos,
        ganancias,
      });
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
        console.log(
          `[PRESUPUESTO] Presupuesto #${created.numeroPresupuesto} creado como ACEPTADO, creando pedido automáticamente`,
          {
            presupuestoId: created.id,
            numeroPresupuesto: created.numeroPresupuesto,
            clienteId: created.clienteId,
            totalFinal: created.totalFinal,
          }
        );
        await createPedidoFromPresupuesto(created.id, {
          clienteId: created.clienteId,
          fechaVencimiento: created.fechaVencimiento,
        });
      } catch (error) {
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${created.numeroPresupuesto}:`,
          {
            presupuestoId: created.id,
            numeroPresupuesto: created.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          }
        );
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
        impuestoActivo.porcentaje
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch (error) {
      console.warn("[PRESUPUESTO] No se pudo calcular IVA, usando valores sin impuesto", {
        error: error instanceof Error ? error.message : String(error),
        presupuestoId: id,
        totalCosto,
        costosIndirectos,
        ganancias,
      });
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
        console.log(
          `[PRESUPUESTO] Estado cambiado a ACEPTADO para presupuesto #${updated.numeroPresupuesto}, creando pedido automáticamente`,
          {
            presupuestoId: updated.id,
            numeroPresupuesto: updated.numeroPresupuesto,
            estadoAnterior: existing.estado,
            estadoNuevo: estado,
            clienteId: updated.clienteId,
            totalFinal: updated.totalFinal,
          }
        );
        await createPedidoFromPresupuesto(updated.id, {
          clienteId: updated.clienteId,
          fechaVencimiento: updated.fechaVencimiento,
        });
      } catch (error) {
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${updated.numeroPresupuesto}:`,
          {
            presupuestoId: updated.id,
            numeroPresupuesto: updated.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          }
        );
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
      typeof payload.totalCosto === "number"
        ? payload.totalCosto
        : Number(existing.totalCosto) || 0;
    const costosIndirectosFromMerged =
      typeof payload.costosIndirectos === "number"
        ? payload.costosIndirectos
        : Number(existing.costosIndirectos) || 0;
    const gananciasFromMerged =
      typeof payload.ganancias === "number" ? payload.ganancias : Number(existing.ganancias) || 0;

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
    } catch (error) {
      console.warn("[PRESUPUESTO] No se pudo calcular IVA, usando valores sin impuesto", {
        error: error instanceof Error ? error.message : String(error),
        presupuestoId: id,
        totalCosto,
        costosIndirectos,
        ganancias,
      });
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
      } catch (error) {
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${updated.numeroPresupuesto} (PATCH):`,
          {
            presupuestoId: updated.id,
            numeroPresupuesto: updated.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString(),
          }
        );
      }
    }

    return updated;
  },

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
