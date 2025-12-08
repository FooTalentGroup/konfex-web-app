import prisma from "../../config/prisma";
import type { CreateProductoDtoDB } from "./producto.types";

export const productoRepository = {
  create: (data: CreateProductoDtoDB) => prisma.producto.create({ data }),

  update: (id: number, data: Partial<CreateProductoDtoDB>) =>
    prisma.producto.update({ where: { id }, data }),

  findAll: () => prisma.producto.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: number) => prisma.producto.findUnique({ where: { id } }),

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
