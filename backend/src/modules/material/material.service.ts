import { materialRepository } from "./material.repository";
import { CreateMaterialDto, UpdateMaterialDto } from "./material.schema";

export const materialService = {
  create: async (data: CreateMaterialDto) => materialRepository.create(data),
  getAll: async () => materialRepository.findAll(),
  getById: async (id: number) => {
    const material = await materialRepository.findById(id);
    if (!material) throw new Error("Material no encontrado");
    return material;
  },
  update: async (id: number, data: UpdateMaterialDto) => {
    const exists = await materialRepository.findById(id);
    if (!exists) throw new Error("Material no encontrado");
    return materialRepository.update(id, data);
  },
  delete: async (id: number) => {
    const exists = await materialRepository.findById(id);
    if (!exists) throw new Error("Material no encontrado");
    return materialRepository.delete(id);
  },
};
