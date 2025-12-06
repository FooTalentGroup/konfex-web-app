import prisma from "../../config/prisma";
import type { CreateCategoriaDto, UpdateCategoriaDto } from "./categoria.schema";

export const categoriaRepository = {
  create: (data: CreateCategoriaDto) => prisma.categoria.create({ data }),

  update: (id: number, data: UpdateCategoriaDto) =>
    prisma.categoria.update({ where: { id }, data }),

  findAll: () => prisma.categoria.findMany({ orderBy: { nombre: "asc" } }),

  findById: (id: number) => prisma.categoria.findUnique({ where: { id } }),

  findByNombre: (nombre: string) => prisma.categoria.findUnique({ where: { nombre } }),

  delete: (id: number) => prisma.categoria.delete({ where: { id } }),

  findMaterialesByCategoriaId: (categoriaId: number, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return prisma.material.findMany({
      where: { categoriaId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        categoria: true,
      },
    });
  },

  countMaterialesByCategoriaId: (categoriaId: number) => {
    return prisma.material.count({
      where: { categoriaId },
    });
  },
};
