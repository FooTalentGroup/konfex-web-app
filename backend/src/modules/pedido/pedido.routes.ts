import { Router } from "express";

import { validationSchema } from "@/middleware";

import {
  getAllPedidosController,
  getPedidoByIdController,
  updatePedidoController,
} from "./pedido.controller";
import { updatePedidoSchema } from "./pedido.schema";

export const pedidoRoutes = Router();

pedidoRoutes.get("/", getAllPedidosController);
pedidoRoutes.get("/:id", getPedidoByIdController);
pedidoRoutes.patch("/:id", validationSchema(updatePedidoSchema), updatePedidoController);

