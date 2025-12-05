import prisma from "../../config/prisma";

export const pedidoRepository = {
  // Crear pedido
  create: (data: {
    presupuestoId: number;
    clienteId: number;
    estado: "PENDIENTE" | "EN_PRODUCCION" | "LISTO" | "ENTREGADO" | "CANCELADO";
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

  // Traer todos
  findAll: (params?: { include?: any }) =>
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

  // Buscar por ID
  findById: (id: number, params?: { include?: any }) =>
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

  // Buscar por presupuestoId
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

  // Actualizar pedido
  update: (id: number, data: {
    estado?: "PENDIENTE" | "EN_PRODUCCION" | "LISTO" | "ENTREGADO" | "CANCELADO";
    pagado?: boolean;
    fechaEntregaEstimada?: Date | null;
    fechaEntregaReal?: Date | null;
  }) =>
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

  // Eliminar pedido
  delete: (id: number) =>
    prisma.pedido.delete({ where: { id } }),
};

