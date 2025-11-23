import { Router } from "express";
import { createClienteSchema, updateClienteSchema } from "./cliente.schema";
import { validationSchema } from "@/middleware";
import { createClienteController, deleteClienteController, getAllClientesController, getClienteByIdController, updateClienteController } from "./cliente.controller";

export const clienteRoutes = Router();

clienteRoutes.get("/", getAllClientesController);
clienteRoutes.get("/:id", getClienteByIdController);

clienteRoutes.post(
  "/",
  validationSchema(createClienteSchema),
  createClienteController
);

clienteRoutes.put(
  "/:id",
  validationSchema(updateClienteSchema),
  updateClienteController
);

clienteRoutes.delete("/:id", deleteClienteController);
