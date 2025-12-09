import prisma from "../../config/prisma";
import { ClienteCreateInput, ClienteUpdateInput } from "./cliente.types";

export const clienteRepository = {
    // Crear cliente
    create: (data: ClienteCreateInput) =>
        prisma.cliente.create({ data }),

    // Actualizar cliente
    update: (id: number, data: ClienteUpdateInput) =>
        prisma.cliente.update({ where: { id }, data }),

    // Traer todos
    findAll: (params?: { include?: any }) =>
        prisma.cliente.findMany({
        orderBy: { createdAt: "desc" },
        include: params?.include,
        }),

    // Buscar por ID
    findById: (id: number, params?: { include?: any }) =>
        prisma.cliente.findUnique({
        where: { id },
        include: params?.include,
        }),

    /** Buscar por nombre */
    findByName: (nombre: string) =>
        prisma.cliente.findUnique({ where: { nombre } }),

    // Eliminar
    delete: (id: number) =>
        prisma.cliente.delete({ where: { id } }),
};
