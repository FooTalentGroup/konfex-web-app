import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  createCategoriaController,
  deleteCategoriaController,
  getAllCategoriaController,
  getCategoriaByIdController,
  getMaterialesByCategoriaController,
  updateCategoriaController,
} from "./categoria.controller";
import { createCategoriaSchema, updateCategoriaSchema } from "./categoria.schema";

export const categoriaRoutes = Router();

categoriaRoutes.get("/", getAllCategoriaController);
categoriaRoutes.get("/:id/materials", getMaterialesByCategoriaController);
categoriaRoutes.get("/:id", getCategoriaByIdController);

categoriaRoutes.post("/", validationSchema(createCategoriaSchema), createCategoriaController);

categoriaRoutes.put("/:id", validationSchema(updateCategoriaSchema), updateCategoriaController);

categoriaRoutes.delete("/:id", deleteCategoriaController);
