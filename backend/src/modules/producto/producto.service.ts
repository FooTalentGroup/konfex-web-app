import { AppError } from "@/common/errors";

import { productoRepository } from "./producto.repository";
import type { CreateProductoDto, UpdateProductoDto } from "./producto.schema";
import type { CreateProductoDtoDB } from "./producto.types";

export const productoService = {
  create: async (data: CreateProductoDto) => {
    const exists = await productoRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("El producto ya existe", 409);
    }

    const dataDB: CreateProductoDtoDB = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      imagen: data.imagen,
      coleccionId: data.coleccionId,
      tallas: data.tallas,
      colores: data.colores,
    };

    return productoRepository.create(dataDB);
  },

  getAll: () => productoRepository.findAll(),

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

  search: async (query: string, limit: number = 10) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return [];
    }

    return productoRepository.search(trimmedQuery, limit);
  },

  update: async (id: number, data: UpdateProductoDto) => {
    await productoService.getById(id);
    return productoRepository.update(id, data);
  },

  delete: async (id: number) => {
    await productoService.getById(id);
    return productoRepository.delete(id);
  },
};
