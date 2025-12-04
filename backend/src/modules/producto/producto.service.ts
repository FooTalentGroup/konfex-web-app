import { AppError } from "@/common/errors";
import { productoRepository } from "./producto.repository";
import { UpdateProductoDto } from "./producto.schema";
import { CreateProductoDtoDB } from "./producto.types";

export const productoService = {
  // Crear producto
  create: async (data: CreateProductoDtoDB) => {
    // Validación de negocio: nombre único (si quieres controlar antes de Prisma)
    const exists = await productoRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("El producto ya existe", 409);
    }

    return productoRepository.create(data);
  },

  // Obtener todos
  getAll: () => productoRepository.findAll(),

  // Obtener por ID
  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const producto = await productoRepository.findById(id);

    if (!producto) {
      throw new AppError("Producto no encontrado", 404);
    }

    return producto;
  },

  // Actualizar
  update: async (id: number, data: UpdateProductoDto) => {
    await productoService.getById(id); // Valida existencia
    return productoRepository.update(id, data);
  },

  // Eliminar
  delete: async (id: number) => {
    await productoService.getById(id); // Valida existencia
    return productoRepository.delete(id);
  },
};
