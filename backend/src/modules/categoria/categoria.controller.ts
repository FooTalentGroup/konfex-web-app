import type { Request } from "express";

import { controllerHandler } from "@/common/handlers";

import type { CreateCategoriaDto, UpdateCategoriaDto } from "./categoria.schema";
import { categoriaService } from "./categoria.service";

export const createCategoriaController = controllerHandler(
  async (req: Request) => {
    const data: CreateCategoriaDto = req.body;
    return await categoriaService.create(data);
  },
  "Categoría creada exitosamente",
  201
);

export const getAllCategoriaController = controllerHandler(async () => {
  return await categoriaService.getAll();
}, "Categorías obtenidas correctamente");

export const getCategoriaByIdController = controllerHandler(async (req: Request) => {
  const id = Number(req.params.id);
  return await categoriaService.getById(id);
}, "Categoría obtenida correctamente");

export const updateCategoriaController = controllerHandler(async (req: Request) => {
  const id = Number(req.params.id);
  const data: UpdateCategoriaDto = req.body;
  return await categoriaService.update(id, data);
}, "Categoría actualizada correctamente");

export const deleteCategoriaController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await categoriaService.delete(id);
    return null;
  },
  "Categoría eliminada correctamente",
  204
);

export const getMaterialesByCategoriaController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    return await categoriaService.getMateriales(id, page, limit);
  },
  "Materiales obtenidos correctamente"
);
