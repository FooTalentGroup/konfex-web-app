import { AppError } from "@/common/errors";

import { productoRepository } from "./producto.repository";
import type { CreateProductoDto, UpdateProductoDto } from "./producto.schema";
import type { CreateProductoDtoDB } from "./producto.types";

export const productoService = {
  // Crear producto
  create: async (data: CreateProductoDto) => {
    // Validación de negocio: nombre único (si quieres controlar antes de Prisma)
    const exists = await productoRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("El producto ya existe", 409);
    }

    // Mapear CreateProductoDto a CreateProductoDtoDB
    const dataDB: CreateProductoDtoDB = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      imagen: data.imagen,
      coleccionId: data.coleccionId,
      tallas: data.tallas,
      colores: data.colores,
      precio: data.precio,
      mermaCantidad: data.wasteMaterial,
      mermaUnidad: data.wasteUnit,
      mermaPrecio: data.wastePrice,
      tarifaCosto: data.tarifaCosto,
      tarifaHoras: data.tarifaHoras,
      materiales: data.materiales,
    };

    return productoRepository.create(dataDB);
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

  // Buscar productos
  search: async (query: string, limit: number = 10) => {
    const trimmedQuery = query.trim();

    // Si el query está vacío o es muy corto, retornar array vacío
    if (trimmedQuery.length < 2) {
      return [];
    }

    return productoRepository.search(trimmedQuery, limit);
  },

  // Actualizar
  update: async (id: number, data: UpdateProductoDto) => {
    await productoService.getById(id); // Valida existencia
    const dataDB: Partial<CreateProductoDtoDB> = {
      ...data,
      mermaCantidad: data.wasteMaterial,
      mermaUnidad: data.wasteUnit,
      mermaPrecio: data.wastePrice,
    };

    // Eliminar propiedades que no existen en la DB si vienen en el DTO (opcional, pero limpio)
    delete (dataDB as any).wasteMaterial;
    delete (dataDB as any).wasteUnit;
    delete (dataDB as any).wastePrice;

    return productoRepository.update(id, dataDB);
  },

  // Eliminar
  delete: async (id: number) => {
    await productoService.getById(id); // Valida existencia
    return productoRepository.delete(id);
  },
};
