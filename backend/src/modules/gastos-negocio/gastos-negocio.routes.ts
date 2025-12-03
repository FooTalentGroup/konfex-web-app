import { Router } from "express";
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
import { validationSchema } from "../../middleware";

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
