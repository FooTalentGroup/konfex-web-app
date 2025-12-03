import { AppError } from "../../common/errors";
import { clienteRepository } from "./cliente.repository";
import { CreateClienteDto, UpdateClienteDto } from "./cliente.schema";

export const clienteService = {
  // Crear cliente
  create: async (data: CreateClienteDto) => {
    // Validación: nombre único
    const exists = await clienteRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("El cliente ya existe", 409);
    }

    return clienteRepository.create(data);
  },

  // Obtener todos
  getAll: () => clienteRepository.findAll(),

  // Obtener por ID
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

  // Actualizar
  update: async (id: number, data: UpdateClienteDto) => {
    await clienteService.getById(id); // valida existencia
    return clienteRepository.update(id, data);
  },

  // Eliminar
  delete: async (id: number) => {
    await clienteService.getById(id); // valida existencia
    return clienteRepository.delete(id);
  },
};
