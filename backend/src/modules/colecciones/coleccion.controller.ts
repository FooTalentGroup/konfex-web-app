import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import type { CreateColeccionDto, UpdateColeccionDto } from "./coleccion.schema";
import { coleccionService } from "./coleccion.service";

export const createColeccionController = controllerHandler(
  async (req: Request) => {
    const data: CreateColeccionDto = req.body;
    return await coleccionService.create(data);
  },
  "Colección creada exitosamente",
  201
);

export const getAllColeccionesController = controllerHandler(
  async () => {
    return await coleccionService.getAll();
  },
  "Colecciones obtenidas correctamente"
);

export const getColeccionByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await coleccionService.getById(id);
  },
  "Colección obtenida correctamente"
);

export const updateColeccionController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateColeccionDto = req.body;
    return await coleccionService.update(id, data);
  },
  "Colección actualizada correctamente"
);

export const deleteColeccionController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await coleccionService.delete(id);
    return null;
  },
  "Colección eliminada correctamente",
  200
);
