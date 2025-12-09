import { AppError } from "@/common/errors";
import prisma from "@/config/prisma";

import { categoriaRepository } from "./categoria.repository";
import type { CreateCategoriaDto, UpdateCategoriaDto } from "./categoria.schema";

export const categoriaService = {
  create: async (data: CreateCategoriaDto) => {
    const categoriaExistente = await categoriaRepository.findByNombre(data.nombre);
    if (categoriaExistente) {
      throw new AppError(`Ya existe una categoría con el nombre "${data.nombre}"`, 400);
    }

    return categoriaRepository.create(data);
  },

  getAll: () => categoriaRepository.findAll(),

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const categoria = await categoriaRepository.findById(id);

    if (!categoria) {
      throw new AppError("Categoría no encontrada", 404);
    }

    return categoria;
  },

  update: async (id: number, data: UpdateCategoriaDto) => {
    await categoriaService.getById(id);

    if (data.nombre) {
      const categoriaExistente = await categoriaRepository.findByNombre(data.nombre);
      if (categoriaExistente && categoriaExistente.id !== id) {
        throw new AppError(`Ya existe una categoría con el nombre "${data.nombre}"`, 400);
      }
    }

    return categoriaRepository.update(id, data);
  },

  delete: async (id: number) => {
    await categoriaService.getById(id);

    const materialesAsociados = await prisma.material.count({
      where: { categoriaId: id },
    });

    if (materialesAsociados > 0) {
      throw new AppError(
        `No se puede eliminar la categoría porque tiene ${materialesAsociados} material(es) asociado(s)`,
        400
      );
    }

    return categoriaRepository.delete(id);
  },

  getMateriales: async (id: number, page = 1, limit = 10) => {
    await categoriaService.getById(id);

    const [materiales, total] = await Promise.all([
      categoriaRepository.findMaterialesByCategoriaId(id, page, limit),
      categoriaRepository.countMaterialesByCategoriaId(id),
    ]);

    return {
      data: materiales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
