import type { Prisma } from "@prisma/client";

import prisma from "../../config/prisma";
import type { CreateColeccionDtoDb, UpdateColeccionDtoDb } from "./coleccion.types";

export const coleccionRepository = {
  create: (data: CreateColeccionDtoDb) => prisma.coleccion.create({ data }),

  update: (id: number, data: UpdateColeccionDtoDb) =>
    prisma.coleccion.update({ where: { id }, data }),

  findAll: (params?: { include?: Prisma.ColeccionInclude }) =>
    prisma.coleccion.findMany({
      orderBy: { createdAt: "desc" },
      include: params?.include,
    }),

  findById: (id: number, params?: { include?: Prisma.ColeccionInclude }) =>
    prisma.coleccion.findUnique({
      where: { id },
      include: params?.include,
    }),

  findByName: (nombre: string) =>
    prisma.coleccion.findUnique({
      where: { nombre },
    }),

  findByCodigo: (codigo: number) =>
    prisma.coleccion.findUnique({
      where: { codigo },
    }),

  findLast: () =>
    prisma.coleccion.findFirst({
      orderBy: { codigo: "desc" },
    }),

  delete: (id: number) => prisma.coleccion.delete({ where: { id } }),
};
