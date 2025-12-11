import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  createColeccionController,
  deleteColeccionController,
  getAllColeccionesController,
  getColeccionByIdController,
  updateColeccionController,
} from "./coleccion.controller";
import { createColeccionSchema, updateColeccionSchema } from "./coleccion.schema";

export const coleccionRoutes = Router();

coleccionRoutes.get("/", getAllColeccionesController);

coleccionRoutes.get("/:id", getColeccionByIdController);

coleccionRoutes.post(
  "/",
  validationSchema(createColeccionSchema),
  createColeccionController
);

coleccionRoutes.put(
  "/:id",
  validationSchema(updateColeccionSchema),
  updateColeccionController
);

// Eliminar colección
coleccionRoutes.delete("/:id", deleteColeccionController);
