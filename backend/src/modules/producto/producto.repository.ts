import prisma from "../../config/prisma";

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
  tallas?: string[];
  colores?: string[];
}

export const productoRepository = {
  create: (data: CreateProductoDto) =>
    prisma.producto.create({ data }),

  update: (id: number, data: Partial<CreateProductoDto>) =>
    prisma.producto.update({ where: { id }, data }),

  findAll: () =>
    prisma.producto.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: number) =>
    prisma.producto.findUnique({ where: { id } }),

  /** 🔥 Nuevo método para validar productos duplicados */
  findByName: (nombre: string) =>
    prisma.producto.findUnique({ where: { nombre } }),

  delete: (id: number) =>
    prisma.producto.delete({ where: { id } }),
};
