import prisma from "../../config/prisma";
import type { CreateProductoDtoDB } from "./producto.types";

export const productoRepository = {
  create: (data: CreateProductoDtoDB) => {
    const { materiales, ...productoData } = data;

    return prisma.producto.create({
      data: {
        ...productoData,
        ...(materiales && materiales.length > 0
          ? {
              materiales: {
                create: materiales.map((m) => ({
                  materialId: m.materialId,
                  cantidad: m.cantidad,
                })),
              },
            }
          : {}),
      },
      include: {
        coleccion: true,
        materiales: {
          include: {
            material: {
              include: {
                categoria: true,
              },
            },
          },
        },
      },
    });
  },

  update: (id: number, data: Partial<CreateProductoDtoDB>) => {
    const { materiales, ...productoData } = data;

    return prisma.producto.update({
      where: { id },
      data: productoData,
    });
  },

  findAll: () =>
    prisma.producto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        coleccion: true,
        materiales: {
          include: {
            material: true,
          },
        },
        pedidos: true,
        presupuestoDetalles: true,
      },
    }),

  findById: (id: number) =>
    prisma.producto.findUnique({
      where: { id },
      include: {
        coleccion: true,
        materiales: {
          include: {
            material: true,
          },
        },
        pedidos: true,
        presupuestoDetalles: true,
      },
    }),

  /** 🔥 Nuevo método para validar productos duplicados */
  findByName: (nombre: string) => prisma.producto.findFirst({ where: { nombre } }),

  /** Búsqueda de productos por nombre o descripción */
  search: (query: string, limit: number = 10) =>
    prisma.producto.findMany({
      where: {
        activo: true,
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { descripcion: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { nombre: "asc" },
      include: {
        coleccion: true,
        materiales: {
          include: {
            material: true,
          },
        },
        pedidos: true,
        presupuestoDetalles: true,
      },
    }),

  delete: (id: number) => prisma.producto.delete({ where: { id } }),
};
