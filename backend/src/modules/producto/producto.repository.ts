import prisma from "../../config/prisma";
import type { CreateProductoDtoDB } from "./producto.types";

export const productoRepository = {
  create: (data: CreateProductoDtoDB) => {
    const { materiales, ...rest } = data;
    return prisma.producto.create({
      data: {
        ...rest,
        materiales: {
          create: materiales?.map((m) => ({
            materialId: m.materialId,
            cantidad: m.cantidad,
          })),
        },
      },
    });
  },

  update: (id: number, data: Partial<CreateProductoDtoDB>) => {
    const { materiales, ...rest } = data;
    return prisma.producto.update({
      where: { id },
      data: {
        ...rest,
        ...(materiales && {
          materiales: {
            deleteMany: {},
            create: materiales.map((m) => ({
              materialId: m.materialId,
              cantidad: m.cantidad,
            })),
          },
        }),
      },
    });
  },

  findAll: () =>
    prisma.producto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        materiales: {
          include: {
            material: true,
          },
        },
      },
    }),

  findById: (id: number) =>
    prisma.producto.findUnique({
      where: { id },
      include: {
        materiales: {
          include: {
            material: true,
          },
        },
      },
    }),

  findByName: (nombre: string) => prisma.producto.findFirst({ where: { nombre } }),

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
    }),

  delete: (id: number) => prisma.producto.delete({ where: { id } }),
};
