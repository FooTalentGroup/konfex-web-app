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

    if (filters?.precioMin !== undefined || filters?.precioMax !== undefined) {
      where.precio = {};
      if (filters?.precioMin !== undefined) {
        where.precio.gte = filters.precioMin;
      }
      if (filters?.precioMax !== undefined) {
        where.precio.lte = filters.precioMax;
      }
    }

    if (filters?.pesoMin !== undefined || filters?.pesoMax !== undefined) {
      where.peso = {};
      if (filters.pesoMin !== undefined) {
        where.peso.gte = filters.pesoMin;
      }
      if (filters.pesoMax !== undefined) {
        where.peso.lte = filters.pesoMax;
      }
    }

    if (filters?.anchoMin !== undefined || filters?.anchoMax !== undefined) {
      where.ancho = {};
      if (filters.anchoMin !== undefined) {
        where.ancho.gte = filters.anchoMin;
      }
      if (filters.anchoMax !== undefined) {
        where.ancho.lte = filters.anchoMax;
      }
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

      if (Object.keys(where).length > 0) {
        const existingWhere = { ...where };

        where.OR = orConditions;

        return prisma.material.findMany({
          where: {
            AND: [existingWhere, { OR: orConditions }],
          },
          orderBy: filters?.sortBy
            ? { [filters.sortBy]: filters.sortOrder || "desc" }
            : { createdAt: "desc" },
          skip: (filters?.page || 1 - 1) * (filters?.limit || 10),
          take: filters?.limit || 10,
          include: { categoria: true },
        });
      } else {
        where.OR = orConditions;
      }
    }

    const orderBy: Prisma.MaterialOrderByWithRelationInput = filters?.sortBy
      ? { [filters.sortBy]: filters.sortOrder || "desc" }
      : { createdAt: "desc" };

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
      if (filters.precioMin !== undefined) {
        where.precio.gte = filters.precioMin;
      }
      if (filters.precioMax !== undefined) {
        where.precio.lte = filters.precioMax;
      }
    }
    if (filters?.pesoMin !== undefined || filters?.pesoMax !== undefined) {
      where.peso = {};
      if (filters.pesoMin !== undefined) {
        where.peso.gte = filters.pesoMin;
      }
      if (filters.pesoMax !== undefined) {
        where.peso.lte = filters.pesoMax;
      }
    }
    if (filters?.anchoMin !== undefined || filters?.anchoMax !== undefined) {
      where.ancho = {};
      if (filters.anchoMin !== undefined) {
        where.ancho.gte = filters.anchoMin;
      }
      if (filters.anchoMax !== undefined) {
        where.ancho.lte = filters.anchoMax;
      }
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
        if (!where.precio) {
          numericConditions.push({
            precio: { gte: numero - tolerancia, lte: numero + tolerancia },
          });
        }
        if (!where.peso) {
          numericConditions.push({
            peso: { gte: numero - tolerancia, lte: numero + tolerancia },
          });
        }
        if (!where.ancho) {
          numericConditions.push({
            ancho: { gte: numero - tolerancia, lte: numero + tolerancia },
          });
        }
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
