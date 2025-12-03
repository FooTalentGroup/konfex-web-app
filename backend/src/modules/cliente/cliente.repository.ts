import prisma from "../../config/prisma";

// Interfaces de input
export interface ClienteCreateInput {
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  origen?: string | null;
  instagramUser?: string | null;
  notas?: string | null;
}

export interface ClienteUpdateInput {
  nombre?: string;
  telefono?: string | null;
  email?: string | null;
  origen?: string | null;
  instagramUser?: string | null;
  notas?: string | null;
}

// Repositorio
export const clienteRepository = {
  create: async (data: ClienteCreateInput) => {
    return prisma.cliente.create({ data });
  },

  findAll: async (params?: { include?: any }) => {
    return prisma.cliente.findMany({
      orderBy: { createdAt: "desc" },
      include: params?.include,
    });
  },

  findById: async (id: number, params?: { include?: any }) => {
    return prisma.cliente.findUnique({
      where: { id },
      include: params?.include,
    });
  },

  update: async (id: number, data: ClienteUpdateInput) => {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.cliente.delete({
      where: { id },
    });
  },
};
