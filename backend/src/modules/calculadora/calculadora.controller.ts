import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { calculadoraService } from "./calculadora.service";
import {
  CreateCalculadoraDto,
  UpdateCalculadoraDto,
} from "./calculadora.schema";

export const createCalculadoraController = controllerHandler(
  async (req: Request) => {
    const data: CreateCalculadoraDto = req.body;
    return await calculadoraService.create(data);
  },
  "Calculadora creada exitosamente",
  201,
);

export const getAllCalculadorasController = controllerHandler(async () => {
  return await calculadoraService.getAll();
}, "Calculadoras obtenidas exitosamente");

export const getCalculadoraByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await calculadoraService.getById(id);
  },
  "Calculadora obtenida exitosamente",
  200,
);

export const updateCalculadoraController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateCalculadoraDto = req.body;
    return await calculadoraService.update(id, data);
  },
  "Calculadora actualizada exitosamente",
  200,
);

export const deleteCalculadoraController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await calculadoraService.delete(id);
    return null;
  },
  "Calculadora eliminada exitosamente",
  204,
);
