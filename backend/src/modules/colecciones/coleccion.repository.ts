import type { Prisma } from "@prisma/client";

import type { CreateColeccionDtoDb, UpdateColeccionDtoDb } from "./coleccion.types";

export const coleccionRepository = {
  create: (data: CreateColeccionDtoDb) => Prisma.coleccion.create({ data }),

  update: (id: number, data: UpdateColeccionDtoDb) =>
    Prisma.coleccion.update({ where: { id }, data }),

  findAll: (params?: { include?: Prisma.ColeccionInclude }) =>
    Prisma.coleccion.findMany({
      orderBy: { createdAt: "desc" },
      include: params?.include,
    }),

  findById: (id: number, params?: { include?: Prisma.ColeccionInclude }) =>
    Prisma.coleccion.findUnique({
      where: { id },
      include: params?.include,
    }),

  findByName: (nombre: string) =>
    Prisma.coleccion.findUnique({
      where: { nombre },
    }),

  findByCodigo: (codigo: number) =>
    Prisma.coleccion.findUnique({
      where: { codigo },
    }),

  findLast: () =>
    Prisma.coleccion.findFirst({
      orderBy: { codigo: "desc" },
    }),

  delete: (id: number) => Prisma.coleccion.delete({ where: { id } }),
};
