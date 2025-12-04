import { Router } from "express";
import type { ZodSchema } from "zod";

import { validationSchema } from "../../middleware";
import {
  createProductoController,
  deleteProductoController,
  getAllProductosController,
  getProductoByIdController,
  searchProductosController,
  updateProductoController,
} from "./producto.controller";
import {
  createProductoSchema,
  productoQuerySchema,
  updateProductoSchema,
} from "./producto.schema";

export const productoRoutes = Router();

productoRoutes.get("/", getAllProductosController);
productoRoutes.get(
  "/search",
  validationSchema(
    productoQuerySchema as ZodSchema<{ body: object; query: object }>
  ),
  searchProductosController
);
productoRoutes.get("/:id", getProductoByIdController);

productoRoutes.post("/", validationSchema(createProductoSchema), createProductoController);

productoRoutes.put("/:id", validationSchema(updateProductoSchema), updateProductoController);

productoRoutes.delete("/:id", deleteProductoController);
