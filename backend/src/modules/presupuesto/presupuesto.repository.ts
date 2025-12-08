import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/prisma";
import type { EstadoPresupuesto } from "./presupuesto.schema";

interface PresupuestoDetalleInput {
  productoId: number;
  descripcion?: string | null;
  cantidad: number;
  costoUnitario: number;
}

interface AdicionalInput {
  nombre: string;
  cantidad: number;
  monto: number;
  totalCosto: number;
  tarifaEnvio?: number | null;
  observaciones?: string | null;
}

interface CreatePresupuestoData {
  data: {
    numeroPresupuesto: number;
    nombre?: string | null;
    clienteId: number | null;
    fechaVencimiento?: Date | null;
    estado: EstadoPresupuesto;
    margenGananciaPorcentaje: number;
    gastosNegocioId: number;
    totalCosto: number;
    costosIndirectos: number;
    ganancias: number;
    iva?: number;
    totalFinal?: number;
    notas?: string | null;
    origen?: string;
    detalles?: PresupuestoDetalleInput[];
    adicionales?: AdicionalInput[];
  };
}

interface UpdatePresupuestoData {
  data: {
    nombre?: string | null;
    clienteId?: number | null;
    fechaVencimiento?: Date | null;
    estado?: EstadoPresupuesto;
    margenGananciaPorcentaje?: number;
    gastosNegocioId?: number;
    totalCosto?: number;
    costosIndirectos?: number;
    ganancias?: number;
    iva?: number;
    totalFinal?: number;
    notas?: string | null;
    origen?: string;
    detalles?: PresupuestoDetalleInput[];
    adicionales?: AdicionalInput[];
  };
}

export const PresupuestoRepository = {
  create: async ({ data }: CreatePresupuestoData) => {
    const { detalles, adicionales, clienteId, costosIndirectos, ...presupuestoData } = data;
    return prisma.presupuesto.create({
      data: {
        ...presupuestoData,
        costosIndirectos,
        clienteId: clienteId ?? null,
        detalles: detalles
          ? {
              create: detalles.map((detalle) => ({
                productoId: detalle.productoId,
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad,
                costoUnitario: detalle.costoUnitario,
              })),
            }
          : undefined,
        adicionales: adicionales
          ? {
              create: adicionales.map((adicional) => ({
                nombre: adicional.nombre,
                cantidad: adicional.cantidad,
                monto: adicional.monto,
                totalCosto: adicional.totalCosto,
                tarifaEnvio: adicional.tarifaEnvio ?? null,
                observaciones: adicional.observaciones,
              })),
            }
          : undefined,
      },
      include: {
        detalles: true,
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
      },
    });
  },

  findMany: async (params?: {
    where?: Prisma.PresupuestoWhereInput;
    include?: Prisma.PresupuestoInclude;
    orderBy?: Prisma.PresupuestoOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) => {
    return prisma.presupuesto.findMany({
      ...params,
      include: {
        detalles: true,
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
        ...params?.include,
      },
    });
  },

  count: (filters?: Prisma.PresupuestoWhereInput) => {
    return prisma.presupuesto.count({
      where: filters,
    });
  },

  findById: async (id: number, options?: { include?: Prisma.PresupuestoInclude }) => {
    return prisma.presupuesto.findUnique({
      where: { id },
      include: {
        detalles: true,
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
        ...options?.include,
      },
    });
  },

  update: async (id: number, { data }: UpdatePresupuestoData) => {
    const { detalles, adicionales, clienteId, costosIndirectos, ...presupuestoData } = data;

    // Si hay detalles definidos (incluso si es array vacío), eliminamos los existentes
    if (detalles !== undefined) {
      // Eliminar detalles existentes
      await prisma.presupuestoDetalle.deleteMany({
        where: { presupuestoId: id },
      });
    }

    // Si hay adicionales definidos (incluso si es array vacío), eliminamos los existentes
    if (adicionales !== undefined) {
      // Eliminar adicionales existentes
      await prisma.adicional.deleteMany({
        where: { presupuestoId: id },
      });
    }

    const updateData: Prisma.PresupuestoUpdateInput = {
      ...presupuestoData,
      costosIndirectos,
      detalles:
        detalles !== undefined
          ? detalles.length > 0
            ? {
                create: detalles.map((detalle) => ({
                  productoId: detalle.productoId,
                  descripcion: detalle.descripcion,
                  cantidad: detalle.cantidad,
                  costoUnitario: detalle.costoUnitario,
                })),
              }
            : undefined // Si es array vacío, no creamos nada (ya se eliminaron)
          : undefined, // Si no se pasa, no tocamos los detalles
      adicionales:
        adicionales !== undefined
          ? adicionales.length > 0
            ? {
                create: adicionales.map((adicional) => ({
                  nombre: adicional.nombre,
                  cantidad: adicional.cantidad,
                  monto: adicional.monto,
                  totalCosto: adicional.totalCosto,
                  tarifaEnvio: adicional.tarifaEnvio ?? null,
                  observaciones: adicional.observaciones,
                })),
              }
            : undefined // Si es array vacío, no creamos nada (ya se eliminaron)
          : undefined, // Si no se pasa, no tocamos los adicionales
    };

    // Manejar clienteId explícitamente para permitir null
    if (clienteId !== undefined) {
      updateData.cliente = clienteId ? { connect: { id: clienteId } } : { disconnect: true };
    }

    // Need to handle partial structure correctly for Prisma update
    // But since 'data' uses simple properties that match schema (except relations),
    // we need to be careful. clientID logic above is valid for Prisma relations.
    // However, existing updateData logic used simple property assignment which works if scalars.
    // Let's refine updateData construction to be type-safe.

    return prisma.presupuesto.update({
      where: { id },
      data: updateData,
      include: {
        detalles: true,
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
      },
    });
  },

  delete: async (id: number) => {
    return prisma.presupuesto.delete({
      where: { id },
    });
  },
};
