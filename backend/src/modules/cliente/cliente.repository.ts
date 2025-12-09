import prisma from "../../config/prisma";
import { ClienteCreateInput, ClienteUpdateInput } from "./cliente.types";

export const clienteRepository = {
    create: (data: ClienteCreateInput) =>
        prisma.cliente.create({ data }),

    update: (id: number, data: ClienteUpdateInput) =>
        prisma.cliente.update({ where: { id }, data }),

    findAll: (params?: { include?: any }) =>
        prisma.cliente.findMany({
        orderBy: { createdAt: "desc" },
        include: params?.include,
        }),

    findById: (id: number, params?: { include?: any }) =>
        prisma.cliente.findUnique({
        where: { id },
        include: params?.include,
        }),

    findByName: (nombre: string) =>
        prisma.cliente.findUnique({ where: { nombre } }),

    delete: (id: number) =>
        prisma.cliente.delete({ where: { id } }),
};
