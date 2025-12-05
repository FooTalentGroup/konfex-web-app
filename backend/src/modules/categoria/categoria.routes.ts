import { Router } from "express";
import {
  createCategoriaController,
  deleteCategoriaController,
  getAllCategoriaController,
  getCategoriaByIdController,
  updateCategoriaController,
} from "./categoria.controller";

import {
  createCategoriaSchema,
  updateCategoriaSchema,
} from "./categoria.schema";
import { validationSchema } from "../../middleware";

export const categoriaRoutes = Router();

categoriaRoutes.get("/", getAllCategoriaController);
categoriaRoutes.get("/:id", getCategoriaByIdController);

categoriaRoutes.post(
  "/",
  validationSchema(createCategoriaSchema),
  createCategoriaController,
);

categoriaRoutes.put(
  "/:id",
  validationSchema(updateCategoriaSchema),
  updateCategoriaController,
);

categoriaRoutes.delete("/:id", deleteCategoriaController);

