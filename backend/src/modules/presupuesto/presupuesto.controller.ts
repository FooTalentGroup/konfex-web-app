import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import {
  toPresupuestoListResponseDto,
  toPresupuestoResponseDto,
} from "./presupuesto.mapper";
import type {
  CreatePresupuestoRequestDto,
  PartialUpdatePresupuestoRequestDto,
  UpdatePresupuestoRequestDto,
} from "./presupuesto.schema";
import { PresupuestoService } from "./presupuesto.service";

// traer todos los presupuestos
export const getPresupuestosController = controllerHandler(
  async () => {
    const presupuestos = await PresupuestoService.getAll();
    return toPresupuestoListResponseDto(presupuestos);
  },
  "Listado de presupuestos obtenido exitosamente"
);

// Trae el número del siguiente presupuesto a generar
export const getNextNumeroPresupuestoController = controllerHandler(
  async () => {
    const nextNumero = await PresupuestoService.getNextNumero();
    return { numeroPresupuesto: nextNumero };
  },
  "Siguiente número de presupuesto obtenido exitosamente"
);

// trae un presupuesto por su id
export const getPresupuestoByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const presupuesto = await PresupuestoService.getById(id);
    return toPresupuestoResponseDto(presupuesto);
  },
  "Presupuesto obtenido exitosamente"
);

// crea un presupuesto
export const createPresupuestoController = controllerHandler(
  async (req: Request) => {
    const body: CreatePresupuestoRequestDto = req.body;
    const presupuesto = await PresupuestoService.create(body);
    return toPresupuestoResponseDto(presupuesto);
  },
  "Presupuesto creado exitosamente",
  201
);

// modifica un presupuesto
export const updatePresupuestoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdatePresupuestoRequestDto = req.body;
    const presupuesto = await PresupuestoService.update(id, data);
    return toPresupuestoResponseDto(presupuesto);
  },
  "Presupuesto actualizado exitosamente"
);

// PATCH Actualiza parcialmente un presupuesto
export const partialUpdatePresupuestoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: PartialUpdatePresupuestoRequestDto = req.body;
    const presupuesto = await PresupuestoService.partialUpdate(id, data);
    return toPresupuestoResponseDto(presupuesto);
  },
  "Presupuesto actualizado parcialmente"
);

// Elimina un presupuesto
export const deletePresupuestoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await PresupuestoService.delete(id);
    return { id };
  },
  "Presupuesto eliminado exitosamente"
);
