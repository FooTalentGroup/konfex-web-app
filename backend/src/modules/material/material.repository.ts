import prisma from "../../config/prisma";
import { CreateMaterialDto } from "./material.schema";
import { MaterialQueryDto } from "./material.schema";

export const materialRepository = {
  create: (data: CreateMaterialDto) =>
    prisma.material.create({ data: data as any }),
  update: (id: number, data: Partial<CreateMaterialDto>) =>
    prisma.material.update({ where: { id }, data }),
  findAll: (filters?: MaterialQueryDto) => {
    const where: any = {};

    // Filtro por categoria
    if (filters?.categoria)
      where.categoria = { equals: filters.categoria, mode: "insensitive" };

    // Filtro por color
    if (filters?.color) where.colores = { has: filters.color };

    // Filtro por rango de precio
    if (filters?.precioMin !== undefined || filters?.precioMax !== undefined) {
      where.precio = {};
      if (filters?.precioMin !== undefined)
        where.precio.gte = filters.precioMin;
      if (filters?.precioMax !== undefined)
        where.precio.lte = filters.precioMax;
    }

    // Filtro por rango de peso
    if (filters?.pesoMin !== undefined || filters?.pesoMax !== undefined) {
      where.peso = {};
      if (filters.pesoMin !== undefined) where.peso.gte = filters.pesoMin;
      if (filters.pesoMax !== undefined) where.peso.lte = filters.pesoMax;
    }

    // Filtro por rango de ancho
    if (filters?.anchoMin !== undefined || filters?.anchoMax !== undefined) {
      where.ancho = {};
      if (filters.anchoMin !== undefined) where.ancho.gte = filters.anchoMin;
      if (filters.anchoMax !== undefined) where.ancho.lte = filters.anchoMax;
    }

    // Filtro por proveedor
    if (filters?.proveedor)
      where.proveedor = { contains: filters.proveedor, mode: "insensitive" };

    // Búsqueda por nombre
    if (filters?.search)
      where.nombre = { contains: filters.search, mode: "insensitive" };

    // Ordenamiento
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || "desc";
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
    });
  },
  count: (filters?: MaterialQueryDto) => {
    const where: any = {};

    if (filters?.categoria) {
      where.categoria = { equals: filters.categoria, mode: "insensitive" };
    }
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
      where.nombre = { contains: filters.search, mode: "insensitive" };
    }

    return prisma.material.count({ where });
  },
  findById: (id: number) => prisma.material.findUnique({ where: { id } }),
  delete: (id: number) => prisma.material.delete({ where: { id } }),
};
