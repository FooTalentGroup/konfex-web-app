// presupuesto.service.ts
import { AppError } from "@/common/errors";
import prisma from "../../config/prisma";

import { PresupuestoRepository } from "./presupuesto.repository";
import type {
  CreatePresupuestoRequestDto,
  PartialUpdatePresupuestoRequestDto,
  UpdatePresupuestoRequestDto,
} from "./presupuesto.schema";
import {
  applyGastosYMargen,
  applyIVA,
  calcTotalCostoFromDetalles,
} from "./utils";
import { impuestoGeneralService } from "../impuesto-general/impuesto-general.service";
import { gastosNegocioService } from "../gastos-negocio/gastos-negocio.service";

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
  },
) {
  const startTime = Date.now();
  
  // Log de inicio
  console.log(`[PEDIDO_AUTO] Iniciando creación automática de pedido para presupuesto #${presupuestoId}`, {
    timestamp: new Date().toISOString(),
    presupuestoId,
    clienteId: presupuesto.clienteId,
  });

  // Validar que tenga clienteId (requerido para pedido)
  if (!presupuesto.clienteId) {
    const error = new AppError(
      "No se puede crear un pedido sin cliente asociado al presupuesto",
      400,
    );
    console.error(`[PEDIDO_AUTO] Error de validación para presupuesto #${presupuestoId}:`, {
      error: error.message,
      presupuestoId,
    });
    throw error;
  }

  // Verificar que no exista ya un pedido para este presupuesto
  const existingPedido = await prisma.pedido.findUnique({
    where: { presupuestoId },
    include: { cliente: true },
  });

  if (existingPedido) {
    // Si ya existe, no hacer nada (idempotencia)
    console.log(`[PEDIDO_AUTO] Pedido ya existe para presupuesto #${presupuestoId}`, {
      pedidoId: existingPedido.id,
      presupuestoId,
      estado: existingPedido.estado,
    });
    return existingPedido;
  }

  // Obtener el presupuesto completo con totalFinal para calcular precios
  const presupuestoCompleto = await prisma.presupuesto.findUnique({
    where: { id: presupuestoId },
    include: {
      cliente: true,
      detalles: true,
      adicionales: true,
    },
  });

  if (!presupuestoCompleto) {
    const error = new AppError(
      "Presupuesto no encontrado",
      404,
    );
    console.error(`[PEDIDO_AUTO] Error: Presupuesto #${presupuestoId} no encontrado`);
    throw error;
  }

  // Obtener los detalles del presupuesto
  const detallesPresupuesto = presupuestoCompleto.detalles || [];

  if (detallesPresupuesto.length === 0) {
    const error = new AppError(
      "No se puede crear un pedido sin detalles en el presupuesto",
      400,
    );
    console.error(`[PEDIDO_AUTO] Error: Presupuesto #${presupuestoId} sin detalles`);
    throw error;
  }

  // Calcular el total de costo de todos los detalles (suma base)
  const totalCostoDetalles = detallesPresupuesto.reduce(
    (sum, detalle) => sum + detalle.cantidad * detalle.costoUnitario,
    0,
  );

  // Calcular el precio unitario proporcional basado en totalFinal
  // Si totalCostoDetalles es 0, usar costoUnitario como fallback
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

  // Crear el pedido con sus detalles
  const pedido = await prisma.pedido.create({
    data: {
      presupuestoId,
      clienteId: presupuesto.clienteId,
      estado: "PENDIENTE",
      fechaEntregaEstimada: presupuesto.fechaVencimiento || null,
      pagado: false,
      detalles: {
        create: detallesPresupuesto.map((detalle) => {
          // Calcular precio unitario proporcional al totalFinal
          const precioUnitario = detalle.costoUnitario * factorPrecio;
          const subtotal = detalle.cantidad * precioUnitario;

          return {
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            costoUnitario: detalle.costoUnitario,
            precioUnitario: Math.round(precioUnitario * 100) / 100, // Redondear a 2 decimales
            subtotal: Math.round(subtotal * 100) / 100, // Redondear a 2 decimales
            // talle y color podrían venir de otra fuente o ser null por ahora
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

  // Log detallado de éxito con información completa
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

  // Notificación estructurada (puede ser consumida por sistemas externos)
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

  // Log de notificación (en producción podría enviarse a un sistema de notificaciones)
  console.log(`[NOTIFICACION] ${notificacion.tipo}`, notificacion);

  return pedido;
}

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
        gastosNegocio: true,
      },
    });

    return items;
  },

  //trae un presupuesto por su id
  getById: async (id: number) => {
    const presupuesto = await PresupuestoRepository.findById(id, {
      include: {
        cliente: true,
        detalles: true,
        pedido: true,
        gastosNegocio: true,
      },
    });
    if (!presupuesto) throw new AppError("Presupuesto no encontrado", 404);
    return presupuesto;
  },

  //crea un presupuesto
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
    } = payload;

    // Obtener el porcentaje de gastosNegocio
    const gastosNegocio = await gastosNegocioService.getById(gastosNegocioId);
    const gastosIndirectosPorcentaje = gastosNegocio.porcentaje;

    let totalCosto =
      typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let costosIndirectos =
      typeof costosIndirectosFromClient === "number"
        ? costosIndirectosFromClient
        : 0;
    let ganancias =
      typeof gananciasFromClient === "number" ? gananciasFromClient : 0;

    // Si vienen detalles, calculamos totales desde los detalles
    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);
      const {
        costosIndirectos: costosCalculados,
        ganancias: gananciasCalculadas,
      } = applyGastosYMargen(
        totalCosto,
        gastosIndirectosPorcentaje,
        margenGananciaPorcentaje,
      );
      costosIndirectos = costosCalculados;
      ganancias = gananciasCalculadas;
    }

    // Calcular IVA y total final usando el ImpuestoGeneral activo
    let iva = 0;
    let totalFinal = totalCosto + costosIndirectos + ganancias;

    try {
      const impuestoActivo = await impuestoGeneralService.getActivo();
      const subtotal = totalCosto + costosIndirectos + ganancias;
      const { iva: ivaCalculado, totalFinal: totalFinalCalculado } = applyIVA(
        subtotal,
        impuestoActivo.porcentaje,
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch (error) {}
    const numeroPresupuesto = await PresupuestoService.getNextNumero();

    const created = await PresupuestoRepository.create({
      data: {
        numeroPresupuesto,
        nombre: nombre ?? null,
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento
          ? new Date(fechaVencimiento)
          : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosNegocioId,
        totalCosto,
        costosIndirectos,
        ganancias,
        iva,
        totalFinal,
        notas,
        detalles,
        adicionales,
      },
    });

    // Si el presupuesto se crea directamente como ACEPTADO, crear el pedido automáticamente
    if (estado === "ACEPTADO" && created.clienteId) {
      try {
        console.log(`[PRESUPUESTO] Presupuesto #${created.numeroPresupuesto} creado como ACEPTADO, creando pedido automáticamente`, {
          presupuestoId: created.id,
          numeroPresupuesto: created.numeroPresupuesto,
          clienteId: created.clienteId,
          totalFinal: created.totalFinal,
        });
        await createPedidoFromPresupuesto(created.id, {
          clienteId: created.clienteId,
          fechaVencimiento: created.fechaVencimiento,
        });
      } catch (error) {
        // Si falla la creación del pedido, loguear pero no fallar la creación del presupuesto
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${created.numeroPresupuesto}:`,
          {
            presupuestoId: created.id,
            numeroPresupuesto: created.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          },
        );
      }
    }

    return created;
  },

  // Actualiza un presupuesto - todo el modelo
  update: async (id: number, payload: UpdatePresupuestoRequestDto) => {
    const existing = await PresupuestoRepository.findById(id, {
      include: { pedido: true, gastosNegocio: true },
    });
    if (!existing) throw new AppError("Presupuesto no encontrado", 404);

    if (existing.pedido)
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400,
      );

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
    } = payload;

    // Obtener el porcentaje de gastosNegocio (usar el nuevo si viene, sino el existente)
    const gastosNegocioIdToUse = gastosNegocioId ?? existing.gastosNegocioId;
    const gastosNegocio =
      await gastosNegocioService.getById(gastosNegocioIdToUse);
    const gastosIndirectosPorcentaje = gastosNegocio.porcentaje;

    // Totales se inicializan en base a lo enviado por el cliente
    let totalCosto =
      typeof totalCostoFromClient === "number" ? totalCostoFromClient : 0;
    let costosIndirectos =
      typeof costosIndirectosFromClient === "number"
        ? costosIndirectosFromClient
        : 0;
    let ganancias =
      typeof gananciasFromClient === "number" ? gananciasFromClient : 0;

    // Si vienen detalles, recalculamos todo (regla de negocio)
    if (Array.isArray(detalles) && detalles.length > 0) {
      totalCosto = calcTotalCostoFromDetalles(detalles);

      const {
        costosIndirectos: costosCalculados,
        ganancias: gananciasCalculadas,
      } = applyGastosYMargen(
        totalCosto,
        gastosIndirectosPorcentaje,
        margenGananciaPorcentaje,
      );

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
        impuestoActivo.porcentaje,
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch (error) {}

    // Actualizar en DB
    const updated = await PresupuestoRepository.update(id, {
      data: {
        nombre: nombre ?? null,
        clienteId: clienteId ?? null,
        fechaVencimiento: fechaVencimiento
          ? new Date(fechaVencimiento)
          : undefined,
        estado,
        margenGananciaPorcentaje,
        gastosNegocioId: gastosNegocioIdToUse,
        totalCosto,
        costosIndirectos,
        ganancias,
        iva,
        totalFinal,
        notas,
        detalles,
        adicionales,
      },
    });

    // Si el estado cambió a ACEPTADO y no tiene pedido asociado, crear el pedido automáticamente
    const estadoCambioAceptado =
      estado === "ACEPTADO" &&
      existing.estado !== "ACEPTADO" &&
      !existing.pedido;

    if (estadoCambioAceptado && updated.clienteId) {
      try {
        console.log(`[PRESUPUESTO] Estado cambiado a ACEPTADO para presupuesto #${updated.numeroPresupuesto}, creando pedido automáticamente`, {
          presupuestoId: updated.id,
          numeroPresupuesto: updated.numeroPresupuesto,
          estadoAnterior: existing.estado,
          estadoNuevo: estado,
          clienteId: updated.clienteId,
          totalFinal: updated.totalFinal,
        });
        await createPedidoFromPresupuesto(updated.id, {
          clienteId: updated.clienteId,
          fechaVencimiento: updated.fechaVencimiento,
        });
      } catch (error) {
        // Si falla la creación del pedido, loguear pero no fallar la actualización del presupuesto
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${updated.numeroPresupuesto}:`,
          {
            presupuestoId: updated.id,
            numeroPresupuesto: updated.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          },
        );
      }
    }

    return updated;
  },

  // Actualiza parcialmente un presupuesto - solo la informacion que recibe
  partialUpdate: async (
    id: number,
    payload: PartialUpdatePresupuestoRequestDto,
  ) => {
    const existing = await PresupuestoRepository.findById(id, {
      include: { pedido: true, gastosNegocio: true },
    });
    if (!existing) throw new AppError("Presupuesto no encontrado", 404);

    if (existing.pedido)
      throw new AppError(
        "No se puede modificar un presupuesto que ya tiene un pedido asociado",
        400,
      );

    // Obtener el porcentaje de gastosNegocio (usar el nuevo si viene, sino el existente)
    const gastosNegocioIdToUse =
      payload.gastosNegocioId ?? existing.gastosNegocioId;
    const gastosNegocio = await gastosNegocioService.getById(
      gastosNegocioIdToUse as number,
    );
    const gastosIndirectosPorcentaje = gastosNegocio.porcentaje;

    // Merge valores actuales con payload para cálculos
    const merged = {
      margenGananciaPorcentaje:
        payload.margenGananciaPorcentaje ?? existing.margenGananciaPorcentaje,
      gastosIndirectosPorcentaje,
      detalles: payload.detalles ?? existing.detalles,
      totalCosto: payload.totalCosto ?? existing.totalCosto,
      costosIndirectos: payload.costosIndirectos ?? existing.costosIndirectos,
      ganancias: payload.ganancias ?? existing.ganancias,
    } as any;

    let totalCosto = merged.totalCosto;
    let costosIndirectos = merged.costosIndirectos;
    let ganancias = merged.ganancias;

    // recalcular totales
    if (payload.detalles !== undefined) {
      if (Array.isArray(payload.detalles) && payload.detalles.length > 0) {
        totalCosto = calcTotalCostoFromDetalles(payload.detalles);
        const {
          costosIndirectos: costosCalculados,
          ganancias: gananciasCalculadas,
        } = applyGastosYMargen(
          totalCosto,
          merged.gastosIndirectosPorcentaje,
          merged.margenGananciaPorcentaje,
        );
        costosIndirectos = costosCalculados;
        ganancias = gananciasCalculadas;
      } else {
        // si el array esta vacío: totales en 0
        totalCosto = 0;
        costosIndirectos = 0;
        ganancias = 0;
      }
    }

    // Calcular IVA y total final usando el ImpuestoGeneral activo
    let iva = 0;
    let totalFinal = totalCosto + costosIndirectos + ganancias;

    try {
      const impuestoActivo = await impuestoGeneralService.getActivo();
      const subtotal = totalCosto + costosIndirectos + ganancias;
      const { iva: ivaCalculado, totalFinal: totalFinalCalculado } = applyIVA(
        subtotal,
        impuestoActivo.porcentaje,
      );
      iva = ivaCalculado;
      totalFinal = totalFinalCalculado;
    } catch (error) {
      // Si no hay impuesto general configurado, iva y totalFinal quedan en 0 y subtotal respectivamente
    }

    const updateData: any = {
      ...payload,
      gastosNegocioId: gastosNegocioIdToUse,
      totalCosto,
      costosIndirectos,
      ganancias,
      iva,
      totalFinal,
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
      data: {
        ...updateData,
        fechaVencimiento: updateData.fechaVencimiento
          ? new Date(updateData.fechaVencimiento)
          : undefined,
      },
    });

    // Si el estado cambió a ACEPTADO y no tiene pedido asociado, crear el pedido automáticamente
    const estadoCambioAceptado =
      payload.estado === "ACEPTADO" &&
      existing.estado !== "ACEPTADO" &&
      !existing.pedido;

    if (estadoCambioAceptado && updated.clienteId) {
      try {
        console.log(`[PRESUPUESTO] Estado cambiado a ACEPTADO (PATCH) para presupuesto #${updated.numeroPresupuesto}, creando pedido automáticamente`, {
          presupuestoId: updated.id,
          numeroPresupuesto: updated.numeroPresupuesto,
          estadoAnterior: existing.estado,
          estadoNuevo: payload.estado,
          clienteId: updated.clienteId,
          totalFinal: updated.totalFinal,
          metodo: "partialUpdate",
        });
        await createPedidoFromPresupuesto(updated.id, {
          clienteId: updated.clienteId,
          fechaVencimiento: updated.fechaVencimiento,
        });
      } catch (error) {
        // Si falla la creación del pedido, loguear pero no fallar la actualización del presupuesto
        console.error(
          `[PRESUPUESTO] Error al crear pedido automáticamente desde presupuesto #${updated.numeroPresupuesto} (PATCH):`,
          {
            presupuestoId: updated.id,
            numeroPresupuesto: updated.numeroPresupuesto,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
          },
        );
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

    // Si hay pedido asociado, podríamos evitar borrado (regla opcional)
    if (existing.pedido)
      throw new AppError(
        "No se puede eliminar un presupuesto que ya tiene un pedido asociado",
        400,
      );

    await PresupuestoRepository.delete(id);
    return true;
  },
};
