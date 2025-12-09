import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  createGastosNegocioController,
  deleteGastosNegocioController,
  getAllGastosNegocioController,
  getGastosNegocioByIdController,
  updateGastosNegocioController,
} from "./gastos-negocio.controller";
import {
  createGastosNegocioSchema,
  updateGastosNegocioSchema,
} from "./gastos-negocio.schema";

export const gastosNegocioRoutes = Router();

gastosNegocioRoutes.get("/", getAllGastosNegocioController);
gastosNegocioRoutes.get("/:id", getGastosNegocioByIdController);

gastosNegocioRoutes.post(
  "/",
  validationSchema(createGastosNegocioSchema),
  createGastosNegocioController,
);

gastosNegocioRoutes.put(
  "/:id",
  validationSchema(updateGastosNegocioSchema),
  updateGastosNegocioController,
);

gastosNegocioRoutes.delete("/:id", deleteGastosNegocioController);
