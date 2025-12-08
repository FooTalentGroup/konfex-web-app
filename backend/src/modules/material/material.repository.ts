import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../config/prisma";
import type { CreateMaterialDto, MaterialQueryDto } from "./material.schema";

export const materialRepository = {
  create: (data: CreateMaterialDto) =>
    prisma.material.create({
      data,
      include: { categoria: true },
    }),
  update: (id: number, data: Partial<CreateMaterialDto>) =>
    prisma.material.update({
      where: { id },
      data,
      include: { categoria: true },
    }),
  findAll: (filters?: MaterialQueryDto) => {
    const where: Prisma.MaterialWhereInput = {};

    if (filters?.color) {
      where.colores = { has: filters.color };
    }

    // Filtro por rango de precio
    if (filters?.precioMin !== undefined || filters?.precioMax !== undefined) {
      where.precio = {};
      if (filters?.precioMin !== undefined) {
        where.precio.gte = filters.precioMin;
      }
      if (filters?.precioMax !== undefined) {
        where.precio.lte = filters.precioMax;
      }
    }

    // Filtro por rango de peso
    if (filters?.pesoMin !== undefined || filters?.pesoMax !== undefined) {
      where.peso = {};
      if (filters.pesoMin !== undefined) {
        where.peso.gte = filters.pesoMin;
      }
      if (filters.pesoMax !== undefined) {
        where.peso.lte = filters.pesoMax;
      }
    }

    // Filtro por rango de ancho
    if (filters?.anchoMin !== undefined || filters?.anchoMax !== undefined) {
      where.ancho = {};
      if (filters.anchoMin !== undefined) {
        where.ancho.gte = filters.anchoMin;
      }
      if (filters.anchoMax !== undefined) {
        where.ancho.lte = filters.anchoMax;
      }
    }

    // Filtro por proveedor
    if (filters?.proveedor) {
      where.proveedor = { contains: filters.proveedor, mode: "insensitive" };
    }

    // Superbuscador: búsqueda en múltiples campos
    if (filters?.search) {
      const consulta = filters.search.trim();
      const orConditions: Prisma.MaterialWhereInput[] = [];

      orConditions.push(
        { nombre: { contains: consulta, mode: "insensitive" } },
        { proveedor: { contains: consulta, mode: "insensitive" } },
        { unidadMedida: { contains: consulta, mode: "insensitive" } }
      );

      orConditions.push({ colores: { has: consulta } });

      const numero = parseFloat(consulta.replace(/[^\d.]/g, ""));
      if (!isNaN(numero)) {
        const tolerancia = numero * 0.01;
        // Solo aplicar si no hay conflictos con filtros existentes, pero Prisma permite ANDs
        // Simplificación: agregamos conditions numéricas
        const numericConditions: Prisma.MaterialWhereInput[] = [];

        if (!where.precio) {
          numericConditions.push({
            precio: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }

        if (!where.peso) {
          numericConditions.push({
            peso: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }

        if (!where.ancho) {
          numericConditions.push({
            ancho: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
        orConditions.push(...numericConditions);
      }

      // Si hay otros filtros, combinarlos con AND
      if (Object.keys(where).length > 0) {
        // Si ya hay condiciones en 'where', tenemos que combinarlas
        // Prisma WhereInput no tiene una propiedad 'AND' directa que acepte el spread del mismo objeto facilmente sin cast,
        // pero podemos hacer:
        const existingWhere = { ...where };
        // clear properties from 'where' object to avoid duplication if we want to restructure,
        // or properly straightforwardly using explicit AND:

        // Reset where and use AND
        // However, simpler approach to avoid 'any' casting mess:
        // Just modify 'where' to include OR for the search conditions.
        // Note: Prisma allows explicit AND/OR fields.
        where.OR = orConditions;

        // NOTE: The original logic tried to put everything into an AND array if keys existed.
        // A cleaner way for Prisma is: keep existing properties on `where` and just add `AND` or `OR`
        // If we want "Existing Filters AND (Search OR Conditions)"

        // Re-implementing strictly:
        // We can't easily clear `where` properties in a typed way.
        // Instead, let's construct a new root where.

        return prisma.material.findMany({
          where: {
            AND: [existingWhere, { OR: orConditions }],
          },
          orderBy: filters?.sortBy
            ? { [filters.sortBy]: filters.sortOrder || "desc" }
            : { createdAt: "desc" },
          skip: (filters?.page || 1 - 1) * (filters?.limit || 10), // Correct calculation below
          take: filters?.limit || 10,
          include: { categoria: true },
        });
      } else {
        where.OR = orConditions;
      }
    }

    // Ordenamiento
    const orderBy: Prisma.MaterialOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      // filters.sortBy is string, strict typing might require check or cast if keyof OrderBy
      // Assuming generic sort
      (orderBy as any)[filters.sortBy] = filters.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Paginación
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    return prisma.material.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        categoria: true,
      },
    });
  },
  count: (filters?: MaterialQueryDto) => {
    const where: Prisma.MaterialWhereInput = {};

    if (filters?.color) {
      where.colores = { has: filters.color };
    }
    if (filters?.precioMin !== undefined || filters?.precioMax !== undefined) {
      where.precio = {};
      if (filters.precioMin !== undefined) where.precio.gte = filters.precioMin;
      if (filters.precioMax !== undefined) where.precio.lte = filters.precioMax;
    }
    if (filters?.pesoMin !== undefined || filters?.pesoMax !== undefined) {
      where.peso = {};
      if (filters.pesoMin !== undefined) where.peso.gte = filters.pesoMin;
      if (filters.pesoMax !== undefined) where.peso.lte = filters.pesoMax;
    }
    if (filters?.anchoMin !== undefined || filters?.anchoMax !== undefined) {
      where.ancho = {};
      if (filters.anchoMin !== undefined) where.ancho.gte = filters.anchoMin;
      if (filters.anchoMax !== undefined) where.ancho.lte = filters.anchoMax;
    }
    if (filters?.proveedor) {
      where.proveedor = { contains: filters.proveedor, mode: "insensitive" };
    }

    if (filters?.search) {
      const consulta = filters.search.trim();
      const orConditions: Prisma.MaterialWhereInput[] = [];

      orConditions.push(
        { nombre: { contains: consulta, mode: "insensitive" } },
        { proveedor: { contains: consulta, mode: "insensitive" } },
        { unidadMedida: { contains: consulta, mode: "insensitive" } }
      );

      orConditions.push({ colores: { has: consulta } });

      const numero = parseFloat(consulta.replace(/[^\d.]/g, ""));
      if (!isNaN(numero)) {
        const tolerancia = numero * 0.01;
        const numericConditions: Prisma.MaterialWhereInput[] = [];
        if (!where.precio)
          numericConditions.push({
            precio: { gte: numero - tolerancia, lte: numero + tolerancia },
          });
        if (!where.peso)
          numericConditions.push({ peso: { gte: numero - tolerancia, lte: numero + tolerancia } });
        if (!where.ancho)
          numericConditions.push({ ancho: { gte: numero - tolerancia, lte: numero + tolerancia } });
        orConditions.push(...numericConditions);
      }

      if (Object.keys(where).length > 0) {
        const existingWhere = { ...where };
        return prisma.material.count({
          where: {
            AND: [existingWhere, { OR: orConditions }],
          },
        });
      } else {
        where.OR = orConditions;
      }
    }

    return prisma.material.count({ where });
  },
  findById: (id: number) =>
    prisma.material.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    }),
  delete: (id: number) => prisma.material.delete({ where: { id } }),
};
