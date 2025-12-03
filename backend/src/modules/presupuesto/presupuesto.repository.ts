import prisma from "../../config/prisma";
import type { EstadoPresupuesto } from "./presupuesto.schema";

interface PresupuestoDetalleInput {
  productoId: number;
  descripcion?: string | null;
  cantidad: number;
  costoUnitario: number;
}

interface CreatePresupuestoData {
  data: {
    numeroPresupuesto: number;
    clienteId: number | null;
    fechaVencimiento?: Date | null;
    estado: EstadoPresupuesto;
    margenGananciaPorcentaje: number;
    gastosIndirectosPorcentaje: number;
    totalCosto: number;
    totalVenta: number;
    notas?: string | null;
    detalles?: PresupuestoDetalleInput[];
  };
}

interface UpdatePresupuestoData {
  data: {
    clienteId?: number | null;
    fechaVencimiento?: Date | null;
    estado?: EstadoPresupuesto;
    margenGananciaPorcentaje?: number;
    gastosIndirectosPorcentaje?: number;
    totalCosto?: number;
    totalVenta?: number;
    notas?: string | null;
    detalles?: PresupuestoDetalleInput[];
  };
}

export const PresupuestoRepository = {
  create: async ({ data }: CreatePresupuestoData) => {
    const { detalles, clienteId, ...presupuestoData } = data;
    return prisma.presupuesto.create({
      data: {
        ...presupuestoData,
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
      } as any,
      include: {
        detalles: true,
        cliente: true,
        pedido: true,
      },
    });
  },

  findMany: async (params?: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }) => {
    return prisma.presupuesto.findMany({
      ...params,
      include: {
        detalles: true,
        cliente: true,
        pedido: true,
        ...params?.include,
      },
    });
  },

  count: (filters?: any) => {
    return prisma.presupuesto.count({
      where: filters,
    });
  },

  findById: async (id: number, options?: { include?: any }) => {
    return prisma.presupuesto.findUnique({
      where: { id },
      include: {
        detalles: true,
        cliente: true,
        pedido: true,
        ...options?.include,
      },
    });
  },

  update: async (id: number, { data }: UpdatePresupuestoData) => {
    const { detalles, clienteId, ...presupuestoData } = data;

    // Si hay detalles definidos (incluso si es array vacío), eliminamos los existentes
    if (detalles !== undefined) {
      // Eliminar detalles existentes
      await prisma.presupuestoDetalle.deleteMany({
        where: { presupuestoId: id },
      });
    }

    const updateData: any = {
      ...presupuestoData,
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
    };

    // Manejar clienteId explícitamente para permitir null
    if (clienteId !== undefined) {
      updateData.clienteId = clienteId;
    }

    return prisma.presupuesto.update({
      where: { id },
      data: updateData,
      include: {
        detalles: true,
        cliente: true,
        pedido: true,
      },
    });
  },

  delete: async (id: number) => {
    return prisma.presupuesto.delete({
      where: { id },
    });
  },
};
