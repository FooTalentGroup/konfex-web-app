import { Router } from "express";

import { validationSchema } from "../../middleware";
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
