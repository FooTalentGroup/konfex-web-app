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
      } as any,
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
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
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
        adicionales: true,
        cliente: true,
        pedido: true,
        gastosNegocio: true,
        ...options?.include,
      },
    });
  },

  update: async (id: number, { data }: UpdatePresupuestoData) => {
    const {
      detalles,
      adicionales,
      clienteId,
      costosIndirectos,
      gastosNegocioId,
      ...presupuestoData
    } = data;

    if (detalles !== undefined) {
      await prisma.presupuestoDetalle.deleteMany({
        where: { presupuestoId: id },
      });
    }

    if (adicionales !== undefined) {
      await prisma.adicional.deleteMany({
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
            : undefined
          : undefined,
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
            : undefined
          : undefined,
    };

    if (clienteId !== undefined) {
      updateData.clienteId = clienteId;
    }

    if (gastosNegocioId !== undefined) {
      updateData.gastosNegocio = {
        connect: { id: gastosNegocioId },
      };
    }

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
