import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import type { CreateMaterialDto, MaterialQueryDto, UpdateMaterialDto } from "./material.schema";
import { materialService } from "./material.service";

export const createMaterialController = controllerHandler(
  async (req: Request) => {
    const data: CreateMaterialDto = req.body;
    const material = await materialService.create(data);
    return material;
  },
  "Material creado exitosamente",
  201
);

export const getAllMaterialsController = controllerHandler(async (req: Request) => {
  const filters = (req.validatedQuery as MaterialQueryDto | undefined) || undefined;
  const materiales = await materialService.getAll(filters);
  return materiales;
}, "Materiales obtenidos correctamente");

export const getMaterialByIdController = controllerHandler(async (req: Request) => {
  const params = req.validatedParams || req.params;
  const id = typeof params.id === "number" ? params.id : Number(params.id);
  const material = await materialService.getById(id);
  return material;
}, "Material obtenido correctamente");

export const updateMaterialController = controllerHandler(async (req: Request) => {
  const params = req.validatedParams || req.params;
  const id = typeof params.id === "number" ? params.id : Number(params.id);
  const data: UpdateMaterialDto = req.body;
  const material = await materialService.update(id, data);
  return material;
}, "Material actualizado correctamente");

export const deleteMaterialController = controllerHandler(
  async (req: Request) => {
    const params = req.validatedParams || req.params;
    const id = typeof params.id === "number" ? params.id : Number(params.id);
    await materialService.delete(id);
    return null;
  },
  "Material eliminado correctamente",
  204
);
