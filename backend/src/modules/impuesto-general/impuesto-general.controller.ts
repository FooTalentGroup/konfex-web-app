import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { impuestoGeneralService } from "./impuesto-general.service";
import {
  CreateImpuestoGeneralDto,
  UpdateImpuestoGeneralDto,
} from "./impuesto-general.schema";

export const createImpuestoGeneralController = controllerHandler(
  async (req: Request) => {
    const data: CreateImpuestoGeneralDto = req.body;
    return await impuestoGeneralService.create(data);
  },
  "Impuesto general creado exitosamente",
  201,
);

export const getAllImpuestoGeneralController = controllerHandler(async () => {
  return await impuestoGeneralService.getAll();
}, "Impuestos generales obtenidos correctamente");

export const getImpuestoGeneralByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await impuestoGeneralService.getById(id);
  },
  "Impuesto general obtenido correctamente",
);

export const getImpuestoGeneralActivoController = controllerHandler(
  async () => {
    return await impuestoGeneralService.getActivo();
  },
  "Impuesto general activo obtenido correctamente",
);

export const updateImpuestoGeneralController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateImpuestoGeneralDto = req.body;
    return await impuestoGeneralService.update(id, data);
  },
  "Impuesto general actualizado correctamente",
);

export const deleteImpuestoGeneralController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await impuestoGeneralService.delete(id);
    return null;
  },
  "Impuesto general eliminado correctamente",
  204,
);

