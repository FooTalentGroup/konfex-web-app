import type { prisma } from "../../config/prisma";

export interface CreateImpuestoGeneralDto {
  nombre: string;
  porcentaje: number;
}

export const impuestoGeneralRepository = {
  create: (data: CreateImpuestoGeneralDto) => prisma.impuestoGeneral.create({ data }),

  update: (id: number, data: Partial<CreateImpuestoGeneralDto>) =>
    prisma.impuestoGeneral.update({ where: { id }, data }),

  findAll: () => prisma.impuestoGeneral.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: number) => prisma.impuestoGeneral.findUnique({ where: { id } }),

  findFirst: () => prisma.impuestoGeneral.findFirst(),

  delete: (id: number) => prisma.impuestoGeneral.delete({ where: { id } }),
};
