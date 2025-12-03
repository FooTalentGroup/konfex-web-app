import prisma from "../../config/prisma";

export interface CreateGastosNegocioDto {
  nombre: string;
  porcentaje: number;
}

export const gastosNegocioRepository = {
  create: (data: CreateGastosNegocioDto) =>
    prisma.gastosNegocio.create({ data }),

  update: (id: number, data: Partial<CreateGastosNegocioDto>) =>
    prisma.gastosNegocio.update({ where: { id }, data }),

  findAll: () =>
    prisma.gastosNegocio.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: number) => prisma.gastosNegocio.findUnique({ where: { id } }),

  delete: (id: number) => prisma.gastosNegocio.delete({ where: { id } }),
};
