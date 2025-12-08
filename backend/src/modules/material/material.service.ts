import { AppError } from "@/common/errors";
import prisma from "@/config/prisma";

import { materialRepository } from "./material.repository";
import type { CreateMaterialDto, MaterialQueryDto, UpdateMaterialDto } from "./material.schema";

export const materialService = {
  create: async (data: CreateMaterialDto) => {
    // Validar que la categoría exista
    const categoria = await prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });
    if (!categoria) {
      throw new AppError("La categoría especificada no existe", 400);
    }
    return materialRepository.create(data);
  },
  getAll: async (filters?: MaterialQueryDto) => {
    const [materials, total] = await Promise.all([
      materialRepository.findAll(filters),
      materialRepository.count(filters),
    ]);

    return {
      data: materials,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total,
        totalPages: Math.ceil(total / (filters?.limit || 10)),
      },
    };
  },
  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const material = await materialRepository.findById(id);

    if (!material) {
      throw new AppError("Material no encontrado", 404);
    }

    return material;
  },
  update: async (id: number, data: UpdateMaterialDto) => {
    await materialService.getById(id);

    // Validar que la categoría exista si se está actualizando
    if (data.categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: data.categoriaId },
      });
      if (!categoria) {
        throw new AppError("La categoría especificada no existe", 400);
      }
    }

    return materialRepository.update(id, data);
  },
  delete: async (id: number) => {
    await materialService.getById(id);
    return materialRepository.delete(id);
  },
};
