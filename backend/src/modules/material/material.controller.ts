import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { materialService } from "./material.service";
import { CreateMaterialDto, UpdateMaterialDto } from "./material.schema";

// Crear material
export const createMaterialController = controllerHandler(
  async (req: Request) => {
    const data: CreateMaterialDto = req.body;
    const material = await materialService.create(data);
    return material;
  },
  "Material creado exitosamente",
  201
);

// Obtener todos los materiales
export const getAllMaterialsController = controllerHandler(
  async (_req: Request) => {
    const materiales = await materialService.getAll();
    return materiales;
  },
  "Materiales obtenidos correctamente"
);

// Obtener material por ID
export const getMaterialByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const material = await materialService.getById(id);
    return material;
  },
  "Material obtenido correctamente"
);

// Actualizar material
export const updateMaterialController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateMaterialDto = req.body;
    const material = await materialService.update(id, data);
    return material;
  },
  "Material actualizado correctamente"
);

// Eliminar material
export const deleteMaterialController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await materialService.delete(id);
    return null; // el handler ignora el body con status 204
  },
  "Material eliminado correctamente",
  204
);
