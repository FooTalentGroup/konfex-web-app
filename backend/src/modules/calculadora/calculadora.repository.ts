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
};
