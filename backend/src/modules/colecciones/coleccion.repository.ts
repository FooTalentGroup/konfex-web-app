import prisma from "../../config/prisma";
import { CreateColeccionDtoDb, UpdateColeccionDtoDb } from "./coleccion.types";

export const coleccionRepository = {
// Crear colección
    create: (data: CreateColeccionDtoDb) =>
        prisma.coleccion.create({ data }),

    // Actualizar colección
    update: (id: number, data: UpdateColeccionDtoDb) =>
        prisma.coleccion.update({ where: { id }, data }),

    // Traer todas las colecciones
    findAll: (params?: { include?: any }) =>
        prisma.coleccion.findMany({
        orderBy: { createdAt: "desc" },
        include: params?.include,
        }),

    // Buscar por ID
    findById: (id: number, params?: { include?: any }) =>
        prisma.coleccion.findUnique({
        where: { id },
        include: params?.include,
        }),

    // Buscar por nombre
    findByName: (nombre: string) =>
        prisma.coleccion.findUnique({
        where: { nombre },
        }),

    // Buscar por código
    findByCodigo: (codigo: number) =>
        prisma.coleccion.findUnique({
        where: { codigo },
        }),

    findLast: () =>
        prisma.coleccion.findFirst({
            orderBy: { codigo: "desc" },
        }),        

    // Eliminar colección
    delete: (id: number) =>
        prisma.coleccion.delete({ where: { id } }),
};
