import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { categoriaService } from "./categoria.service";
import {
  CreateCategoriaDto,
  UpdateCategoriaDto,
} from "./categoria.schema";

export const createCategoriaController = controllerHandler(
  async (req: Request) => {
    const data: CreateCategoriaDto = req.body;
    return await categoriaService.create(data);
  },
  "Categoría creada exitosamente",
  201,
);

export const getAllCategoriaController = controllerHandler(async () => {
  return await categoriaService.getAll();
}, "Categorías obtenidas correctamente");

export const getCategoriaByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await categoriaService.getById(id);
  },
  "Categoría obtenida correctamente",
);

export const updateCategoriaController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateCategoriaDto = req.body;
    return await categoriaService.update(id, data);
  },
  "Categoría actualizada correctamente",
);

export const deleteCategoriaController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await categoriaService.delete(id);
    return null;
  },
  "Categoría eliminada correctamente",
  204,
);

