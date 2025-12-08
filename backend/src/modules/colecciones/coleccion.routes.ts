import { Router } from "express";
import {
  getAllColeccionesController,
  getColeccionByIdController,
  createColeccionController,
  updateColeccionController,
  deleteColeccionController,
} from "./coleccion.controller";

import { validationSchema } from "../../middleware";
import { createColeccionSchema, updateColeccionSchema } from "./coleccion.schema";

export const coleccionRoutes = Router();

coleccionRoutes.get("/", getAllColeccionesController);

coleccionRoutes.get("/:id", getColeccionByIdController);

coleccionRoutes.post("/", validationSchema(createColeccionSchema), createColeccionController);

coleccionRoutes.put("/:id", validationSchema(updateColeccionSchema), updateColeccionController);

coleccionRoutes.delete("/:id", deleteColeccionController);
