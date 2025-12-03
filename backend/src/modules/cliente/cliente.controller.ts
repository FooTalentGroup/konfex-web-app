import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import type { CreateClienteDto, UpdateClienteDto } from "./cliente.schema";
import { clienteService } from "./cliente.service";

// Crear cliente
export const createClienteController = controllerHandler(
  async (req: Request) => {
    const data: CreateClienteDto = req.body;
    const cliente = await clienteService.create(data);
    return cliente;
  },
  "Cliente creado exitosamente",
  201
);

// Obtener todos los clientes
export const getAllClientesController = controllerHandler(async (_req: Request) => {
  const clientes = await clienteService.getAll();
  return clientes;
}, "Clientes obtenidos correctamente");

// Obtener cliente por ID
export const getClienteByIdController = controllerHandler(async (req: Request) => {
  const id = Number(req.params.id);
  const cliente = await clienteService.getById(id);
  return cliente;
}, "Cliente obtenido correctamente");

// Actualizar cliente
export const updateClienteController = controllerHandler(async (req: Request) => {
  const id = Number(req.params.id);
  const data: UpdateClienteDto = req.body;
  const cliente = await clienteService.update(id, data);
  return cliente;
}, "Cliente actualizado correctamente");

// Eliminar cliente
export const deleteClienteController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await clienteService.delete(id);
    return null; // body se ignora
  },
  "Cliente eliminado correctamente",
  204
);
