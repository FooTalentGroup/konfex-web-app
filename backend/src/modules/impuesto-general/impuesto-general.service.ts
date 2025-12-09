import { AppError } from "../../common/errors";
import { impuestoGeneralRepository } from "./impuesto-general.repository";
import type { CreateImpuestoGeneralDto, UpdateImpuestoGeneralDto } from "./impuesto-general.schema";

export const impuestoGeneralService = {
  create: async (data: CreateImpuestoGeneralDto) => {
    const existing = await impuestoGeneralRepository.findFirst();
    if (existing) {
      throw new AppError(
        "Ya existe un impuesto general. Solo puede haber uno activo. Use PUT para actualizarlo.",
        409
      );
    }
    return impuestoGeneralRepository.create(data);
  },

  getAll: () => impuestoGeneralRepository.findAll(),

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const impuesto = await impuestoGeneralRepository.findById(id);

    if (!impuesto) {
      throw new AppError("Impuesto general no encontrado", 404);
    }

    return impuesto;
  },

  getActivo: async () => {
    const impuesto = await impuestoGeneralRepository.findFirst();
    if (!impuesto) {
      throw new AppError("No hay un impuesto general configurado. Debe crear uno primero.", 404);
    }
    return impuesto;
  },

  update: async (id: number, data: UpdateImpuestoGeneralDto) => {
    await impuestoGeneralService.getById(id);
    return impuestoGeneralRepository.update(id, data);
  },

  delete: async (id: number) => {
    await impuestoGeneralService.getById(id);
    return impuestoGeneralRepository.delete(id);
  },
};
