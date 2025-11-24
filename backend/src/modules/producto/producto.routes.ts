import { Router } from "express";
import {
  createProductoController,
  deleteProductoController,
  getAllProductosController,
  getProductoByIdController,
  updateProductoController,
} from "./producto.controller";

import {
  createProductoSchema,
  updateProductoSchema,
} from "./producto.schema";
import { validationSchema } from "../../middleware";

export const productoRoutes = Router();

productoRoutes.get("/", getAllProductosController);
productoRoutes.get("/:id", getProductoByIdController);

productoRoutes.post(
  "/",
  validationSchema(createProductoSchema),
  createProductoController
);

productoRoutes.put(
  "/:id",
  validationSchema(updateProductoSchema),
  updateProductoController
);

productoRoutes.delete("/:id", deleteProductoController);
