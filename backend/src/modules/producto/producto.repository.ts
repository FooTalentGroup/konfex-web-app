import prisma from "../../config/prisma";
import { CreateProductoDtoDB } from "./producto.types";


export const productoRepository = {
  create: (data: CreateProductoDtoDB) =>
    prisma.producto.create({ data }),

  update: (id: number, data: Partial<CreateProductoDtoDB>) =>
    prisma.producto.update({ where: { id }, data }),

  findAll: () =>
    prisma.producto.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: number) =>
    prisma.producto.findUnique({ where: { id } }),

  findByName: (nombre: string) =>
    prisma.producto.findFirst({ where: { nombre } }),

  delete: (id: number) =>
    prisma.producto.delete({ where: { id } }),
};
