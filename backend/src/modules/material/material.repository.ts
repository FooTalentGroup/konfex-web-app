import prisma from "../../config/prisma";

interface CreateMaterialDto {
    nombre: string;
    costoUnitario: number;
    unidadMedida: string;
    tipo?: string;
    stock: number;
  }
  
  export const materialRepository = {
    create: (data: CreateMaterialDto) =>
      prisma.material.create({ data }),
    update: (id: number, data: Partial<CreateMaterialDto>) =>
      prisma.material.update({ where: { id }, data }),
    findAll: () => prisma.material.findMany({ orderBy: { createdAt: "desc" } }),
    findById: (id: number) => prisma.material.findUnique({ where: { id } }),
    delete: (id: number) => prisma.material.delete({ where: { id } }),
  };
  
