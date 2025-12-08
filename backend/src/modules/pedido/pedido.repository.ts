import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/prisma";

export const pedidoRepository = {
  create: (data: {
    presupuestoId: number;
    clienteId: number;
    estado?: "NO_VISTO" | "EN_COMPRA" | "EN_PRODUCCION" | "ENTREGADO";
    pagado?: boolean;
    fechaEntregaEstimada?: Date | null;
  }) =>
    prisma.pedido.create({
      data,
      include: {
        cliente: true,
        presupuesto: {
          select: {
            id: true,
            numeroPresupuesto: true,
            nombre: true,
            totalFinal: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        etapas: true,
      },
    }),

  findAll: (params?: { include?: Prisma.PedidoInclude }) =>
    prisma.pedido.findMany({
      orderBy: { createdAt: "desc" },
      include: params?.include || {
        cliente: true,
        presupuesto: {
          select: {
            id: true,
            numeroPresupuesto: true,
            nombre: true,
            totalFinal: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        etapas: {
          orderBy: { fechaInicio: "desc" },
        },
      },
    }),

  findById: (id: number, params?: { include?: Prisma.PedidoInclude }) =>
    prisma.pedido.findUnique({
      where: { id },
      include: params?.include || {
        cliente: true,
        presupuesto: {
          select: {
            id: true,
            numeroPresupuesto: true,
            nombre: true,
            totalFinal: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        etapas: {
          orderBy: { fechaInicio: "desc" },
        },
      },
    }),

  findByPresupuestoId: (presupuestoId: number) =>
    prisma.pedido.findUnique({
      where: { presupuestoId },
      include: {
        cliente: true,
        presupuesto: {
          select: {
            id: true,
            numeroPresupuesto: true,
            nombre: true,
            totalFinal: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        etapas: {
          orderBy: { fechaInicio: "desc" },
        },
      },
    }),

  update: (
    id: number,
    data: {
      estado?: "NO_VISTO" | "EN_COMPRA" | "EN_PRODUCCION" | "ENTREGADO";
      pagado?: boolean;
      fechaEntregaEstimada?: Date | null;
      fechaEntregaReal?: Date | null;
    }
  ) =>
    prisma.pedido.update({
      where: { id },
      data,
      include: {
        cliente: true,
        presupuesto: {
          select: {
            id: true,
            numeroPresupuesto: true,
            nombre: true,
            totalFinal: true,
          },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        etapas: {
          orderBy: { fechaInicio: "desc" },
        },
      },
    }),

  delete: (id: number) => prisma.pedido.delete({ where: { id } }),
};
