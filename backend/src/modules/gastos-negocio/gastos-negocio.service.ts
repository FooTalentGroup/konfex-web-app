import type { AppError } from "../../common/errors";
import { gastosNegocioRepository } from "./gastos-negocio.repository";
import type { CreateGastosNegocioDto, UpdateGastosNegocioDto } from "./gastos-negocio.schema";

export const gastosNegocioService = {
  create: async (data: CreateGastosNegocioDto) => {
    return gastosNegocioRepository.create(data);
  },

  getAll: () => gastosNegocioRepository.findAll(),

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const gastosNegocio = await gastosNegocioRepository.findById(id);

    if (!gastosNegocio) {
      throw new AppError("Gastos de negocio no encontrados", 404);
    }

    return gastosNegocio;
  },

  update: async (id: number, data: UpdateGastosNegocioDto) => {
    await gastosNegocioService.getById(id);
    return gastosNegocioRepository.update(id, data);
  },

  delete: async (id: number) => {
    await gastosNegocioService.getById(id);

    return gastosNegocioRepository.delete(id);
  },
};
