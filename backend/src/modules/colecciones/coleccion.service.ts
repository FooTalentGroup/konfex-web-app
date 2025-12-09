import { AppError } from "../../common/errors";
import { coleccionRepository } from "./coleccion.repository";
import type { CreateColeccionDto, UpdateColeccionDto } from "./coleccion.schema";

export const coleccionService = {
  create: async (data: CreateColeccionDto) => {
    const exists = await coleccionRepository.findByName(data.nombre);
    if (exists) {
      throw new AppError("La colección ya existe", 409);
    }

    const last = await coleccionRepository.findLast();
    const nextCodigo = last ? last.codigo + 1 : 1;

    const payload = {
      ...data,
      codigo: nextCodigo,
    };

    return await coleccionRepository.create(payload);
  },

  getAll: () =>
    coleccionRepository.findAll({
      include: {
        productos: true,
      },
    }),

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const coleccion = await coleccionRepository.findById(id, {
      include: {
        productos: true,
      },
    });

    if (!coleccion) {
      throw new AppError("Colección no encontrada", 404);
    }

    return coleccion;
  },

  update: async (id: number, data: UpdateColeccionDto) => {
    await coleccionService.getById(id);

    if (data.nombre) {
      const exists = await coleccionRepository.findByName(data.nombre);
      if (exists && exists.id !== id) {
        throw new AppError("Ya existe una colección con ese nombre", 409);
      }
    }

    return coleccionRepository.update(id, data);
  },

  delete: async (id: number) => {
    const coleccion = await coleccionService.getById(id);

    if (coleccion.productos && coleccion.productos.length > 0) {
      throw new AppError(
        `No se puede eliminar la colección "${coleccion.nombre}" porque tiene ${coleccion.productos.length} producto(s) asociado(s). Elimine primero los productos de esta colección.`,
        409
      );
    }

    try {
      return await coleccionRepository.delete(id);
    } catch (error: unknown) {
      if (error?.code === "P2003" || error?.code === "23001") {
        throw new AppError(
          `No se puede eliminar la colección "${coleccion.nombre}" porque tiene productos asociados. Elimine primero los productos de esta colección.`,
          409
        );
      }
      throw error;
    }
  },
};
