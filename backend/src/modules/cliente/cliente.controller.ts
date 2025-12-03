import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import type { CreateClienteDto, UpdateClienteDto } from "./cliente.schema";
import { clienteService } from "./cliente.service";

export const createClienteController = controllerHandler(
  async (req: Request) => {
    const data: CreateClienteDto = req.body;
    return await clienteService.create(data);
  },
  "Cliente creado exitosamente",
  201
);

export const getAllClientesController = controllerHandler(
  async () => {
    return await clienteService.getAll();
  },
  "Clientes obtenidos correctamente"
);

export const getClienteByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await clienteService.getById(id);
  },
  "Cliente obtenido correctamente"
);

export const updateClienteController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateClienteDto = req.body;
    return await clienteService.update(id, data);
  },
  "Cliente actualizado correctamente"
);

export const deleteClienteController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await clienteService.delete(id);
    return null;
  },
  "Cliente eliminado correctamente",
  200
);
