import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/prisma";

export const clienteRepository = {
  create: (data: Prisma.ClienteCreateInput) => prisma.cliente.create({ data }),

  update: (id: number, data: Prisma.ClienteUpdateInput) =>
    prisma.cliente.update({ where: { id }, data }),

  findAll: (params?: { include?: Prisma.ClienteInclude }) =>
    prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
      include: params?.include,
    }),

  findById: (id: number, params?: { include?: Prisma.ClienteInclude }) =>
    prisma.cliente.findUnique({
      where: { id },
      include: params?.include,
    }),

  findByName: (nombre: string) =>
    prisma.cliente.findFirst({
      where: { nombre },
    }),

  delete: (id: number) => prisma.cliente.delete({ where: { id } }),
};
