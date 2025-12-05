import type { Request } from "express";

import { controllerHandler } from "../../common/handlers";
import type { UpdatePedidoDto } from "./pedido.schema";
import { pedidoService } from "./pedido.service";

// Obtener todos los pedidos
export const getAllPedidosController = controllerHandler(
  async () => {
    return await pedidoService.getAll();
  },
  "Pedidos obtenidos correctamente"
);

// Obtener pedido por ID
export const getPedidoByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await pedidoService.getById(id);
  },
  "Pedido obtenido correctamente"
);

// Actualizar pedido
export const updatePedidoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdatePedidoDto = req.body;
    
    // Convertir fechas de string a Date si vienen
    const updateData: any = { ...data };
    if (data.fechaEntregaEstimada) {
      updateData.fechaEntregaEstimada = new Date(data.fechaEntregaEstimada);
    }
    if (data.fechaEntregaReal) {
      updateData.fechaEntregaReal = new Date(data.fechaEntregaReal);
    }
    
    return await pedidoService.update(id, updateData);
  },
  "Pedido actualizado correctamente"
);

