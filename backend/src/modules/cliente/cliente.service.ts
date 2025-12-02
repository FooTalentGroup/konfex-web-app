import { clienteRepository } from "./cliente.repository";

export const clienteService = {
  create: async (data: any) => {
    return clienteRepository.create(data);
  },

  getAll: async () => {
    return clienteRepository.findAll();
  },

  getById: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {throw new Error("Cliente no encontrado");}
    return cliente;
  },

  update: async (id: number, data: any) => {
    const exists = await clienteRepository.findById(id);
    if (!exists) {throw new Error("Cliente no encontrado");}

    return clienteRepository.update(id, data);
  },

  delete: async (id: number) => {
    const exists = await clienteRepository.findById(id);
    if (!exists) {throw new Error("Cliente no encontrado");}

    return clienteRepository.delete(id);
  },
};
