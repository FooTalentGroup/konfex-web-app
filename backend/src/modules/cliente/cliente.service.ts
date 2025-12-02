import {
  type ClienteCreateInput,
  clienteRepository,
  type ClienteUpdateInput,
} from "./cliente.repository";

export const clienteService = {
  create: async (data: ClienteCreateInput) => {
    return clienteRepository.create(data);
  },

  getAll: async () => {
    return clienteRepository.findAll();
  },

  getById: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }
    return cliente;
  },

  update: async (id: number, data: ClienteUpdateInput) => {
    const exists = await clienteRepository.findById(id);
    if (!exists) {
      throw new Error("Cliente no encontrado");
    }

    return clienteRepository.update(id, data);
  },

  delete: async (id: number) => {
    const exists = await clienteRepository.findById(id);
    if (!exists) {
      throw new Error("Cliente no encontrado");
    }

    return clienteRepository.delete(id);
  },
};
