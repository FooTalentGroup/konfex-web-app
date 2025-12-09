import { AppError } from "../../common/errors";
import { clienteRepository } from "./cliente.repository";
import type { CreateClienteDto, UpdateClienteDto } from "./cliente.schema";

export const clienteService = {
  create: async (data: CreateClienteDto) => {
    const exists = await clienteRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("El cliente ya existe", 409);
    }

    return clienteRepository.create(data);
  },

  getAll: () => clienteRepository.findAll(),

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const cliente = await clienteRepository.findById(id);

    if (!cliente) {
      throw new AppError("Cliente no encontrado", 404);
    }

    return cliente;
  },

  update: async (id: number, data: UpdateClienteDto) => {
    await clienteService.getById(id);
    return clienteRepository.update(id, data);
  },

  delete: async (id: number) => {
    await clienteService.getById(id);
    return clienteRepository.delete(id);
  },
};
