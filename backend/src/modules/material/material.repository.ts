import prisma from "../../config/prisma";
import type { CreateMaterialDto, MaterialQueryDto } from "./material.schema";

export const materialRepository = {
  create: (data: CreateMaterialDto) => prisma.material.create({ data: data as any }),
  update: (id: number, data: Partial<CreateMaterialDto>) =>
    prisma.material.update({ where: { id }, data }),
  findAll: (filters?: MaterialQueryDto) => {
    const where: any = {};

    // Filtro por categoria
    if (filters?.categoria) {
      where.categoria = { equals: filters.categoria, mode: "insensitive" };
    }

    // Filtro por color
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
      const orConditions: any[] = [];

      // Búsqueda en campos de texto
      orConditions.push(
        { nombre: { contains: consulta, mode: "insensitive" } },
        { categoria: { contains: consulta, mode: "insensitive" } },
        { proveedor: { contains: consulta, mode: "insensitive" } },
        { unidadMedida: { contains: consulta, mode: "insensitive" } }
      );

      // Búsqueda en array de colores
      orConditions.push({ colores: { has: consulta } });

      // Intentar parsear como número para buscar en precio, peso y ancho
      // Solo si no hay filtros de rango específicos para esos campos
      const numero = parseFloat(consulta.replace(/[^\d.]/g, ""));
      if (!isNaN(numero)) {
        // Buscar precio exacto o aproximado (con tolerancia del 1%)
        // Solo si no hay filtros de rango de precio
        const tolerancia = numero * 0.01;
        if (!where.precio) {
          orConditions.push({
            precio: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
        // Solo si no hay filtros de rango de peso
        if (!where.peso) {
          orConditions.push({
            peso: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
        // Solo si no hay filtros de rango de ancho
        if (!where.ancho) {
          orConditions.push({
            ancho: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
      }

      // Si hay otros filtros, combinarlos con AND
      if (Object.keys(where).length > 0) {
        where.AND = [
          ...Object.entries(where).map(([key, value]) => ({ [key]: value })),
          { OR: orConditions },
        ];
        // Limpiar las propiedades individuales ya que están en AND
        Object.keys(where).forEach((key) => {
          if (key !== "AND") {
            delete where[key];
          }
        });
      } else {
        where.OR = orConditions;
      }
    }

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

    // Superbuscador: búsqueda en múltiples campos (misma lógica que findAll)
    if (filters?.search) {
      const consulta = filters.search.trim();
      const orConditions: any[] = [];

      // Búsqueda en campos de texto
      orConditions.push(
        { nombre: { contains: consulta, mode: "insensitive" } },
        { categoria: { contains: consulta, mode: "insensitive" } },
        { proveedor: { contains: consulta, mode: "insensitive" } },
        { unidadMedida: { contains: consulta, mode: "insensitive" } }
      );

      // Búsqueda en array de colores
      orConditions.push({ colores: { has: consulta } });

      // Intentar parsear como número para buscar en precio, peso y ancho
      // Solo si no hay filtros de rango específicos para esos campos
      const numero = parseFloat(consulta.replace(/[^\d.]/g, ""));
      if (!isNaN(numero)) {
        // Buscar precio exacto o aproximado (con tolerancia del 1%)
        // Solo si no hay filtros de rango de precio
        const tolerancia = numero * 0.01;
        if (!where.precio) {
          orConditions.push({
            precio: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
        // Solo si no hay filtros de rango de peso
        if (!where.peso) {
          orConditions.push({
            peso: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
        // Solo si no hay filtros de rango de ancho
        if (!where.ancho) {
          orConditions.push({
            ancho: {
              gte: numero - tolerancia,
              lte: numero + tolerancia,
            },
          });
        }
      }

      // Si hay otros filtros, combinarlos con AND
      if (Object.keys(where).length > 0) {
        where.AND = [
          ...Object.entries(where).map(([key, value]) => ({ [key]: value })),
          { OR: orConditions },
        ];
        // Limpiar las propiedades individuales ya que están en AND
        Object.keys(where).forEach((key) => {
          if (key !== "AND") {
            delete where[key];
          }
        });
      } else {
        where.OR = orConditions;
      }
    }

    return prisma.material.count({ where });
  },
  findById: (id: number) => prisma.material.findUnique({ where: { id } }),
  delete: (id: number) => prisma.material.delete({ where: { id } }),
};
