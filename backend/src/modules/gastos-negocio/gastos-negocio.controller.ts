import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { gastosNegocioService } from "./gastos-negocio.service";
import { CreateGastosNegocioDto, UpdateGastosNegocioDto } from "./gastos-negocio.schema";

export const createGastosNegocioController = controllerHandler(
  async (req: Request) => {
    const data: CreateGastosNegocioDto = req.body;
    return await gastosNegocioService.create(data);
  },
  "Gastos de negocio creados exitosamente",
  201
);

export const getAllGastosNegocioController = controllerHandler(
  async () => {
    return await gastosNegocioService.getAll();
  },
  "Gastos de negocio obtenidos correctamente"
);

export const getGastosNegocioByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await gastosNegocioService.getById(id);
  },
  "Gastos de negocio obtenidos correctamente"
);

export const updateGastosNegocioController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateGastosNegocioDto = req.body;
    return await gastosNegocioService.update(id, data);
  },
  "Gastos de negocio actualizados correctamente"
);

export const deleteGastosNegocioController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await gastosNegocioService.delete(id);
    return null;
  },
  "Gastos de negocio eliminados correctamente",
  204
);

