import { Prisma } from "@prisma/client";

import { AppError } from "../../common/errors";
import { productoRepository } from "../producto/producto.repository";
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

  getAll: () => coleccionRepository.findAll(),

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
    await coleccionService.getById(id);

    await productoRepository.deleteByColeccionId(id);

    try {
      return await coleccionRepository.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2003" || error.code === "23001")
      ) {
        throw new AppError(
          "No se puede eliminar la colección porque tiene registros asociados (ej. Pedidos) que dependen de ella o sus productos.",
          409
        );
      }
      throw error;
    }
  },
};
