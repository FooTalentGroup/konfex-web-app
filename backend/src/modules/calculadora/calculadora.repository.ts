import prisma from "../../config/prisma";
import {
  CreateCalculadoraDto,
  UpdateCalculadoraDto,
} from "./calculadora.schema";

export const calculadoraRepository = {
  create: async (data: CreateCalculadoraDto) => {
    return prisma.calculadora.create({
      data,
      include: {
        cliente: true,
        presupuesto: true,
      },
    });
  },

  findAll: async () => {
    return prisma.calculadora.findMany({
      orderBy: { createdAt: "desc" },
      include: { cliente: true, presupuesto: true },
    });
  },

  findById: async (id: number, options?: { include?: any }) => {
    return prisma.calculadora.findUnique({
      where: { id },
      include: {
        cliente: true,
        presupuesto: true,
        ...options?.include,
      },
    });
  },

  update: async (id: number, data: UpdateCalculadoraDto) => {
    return prisma.calculadora.update({
      where: { id },
      data,
      include: {
        cliente: true,
        presupuesto: true,
      },
    });
  },

  delete: async (id: number) => {
    return prisma.calculadora.delete({
      where: { id },
    });
  },
};
