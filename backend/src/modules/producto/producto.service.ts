import { productoRepository } from "./producto.repository";
import { CreateProductoDto, UpdateProductoDto } from "./producto.schema";

export const productoService = {
  create: (data: CreateProductoDto) => productoRepository.create(data),

  getAll: () => productoRepository.findAll(),

  getById: async (id: number) => {
    const producto = await productoRepository.findById(id);
    if (!producto) throw new Error("Producto no encontrado");
    return producto;
  },

  update: async (id: number, data: UpdateProductoDto) => {
    await productoService.getById(id); // valida existencia
    return productoRepository.update(id, data);
  },

  delete: async (id: number) => {
    await productoService.getById(id);
    return productoRepository.delete(id);
  },
};
