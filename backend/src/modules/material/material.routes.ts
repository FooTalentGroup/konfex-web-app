import { Router } from "express";

import { validationSchema } from "@/middleware";

import {
  createMaterialController,
  deleteMaterialController,
  getAllMaterialsController,
  getMaterialByIdController,
  updateMaterialController,
} from "./material.controller";
import {
  createMaterialSchema,
  materialIdSchema,
  materialQuerySchema,
  updateMaterialWithIdSchema,
} from "./material.schema";

export const materialRoutes = Router();

materialRoutes.get(
  "/",
  validationSchema(materialQuerySchema),
  getAllMaterialsController
);
materialRoutes.get(
  "/:id",
  validationSchema(materialIdSchema),
  getMaterialByIdController
);

materialRoutes.post("/", validationSchema(createMaterialSchema), createMaterialController);
materialRoutes.put(
  "/:id",
  validationSchema(updateMaterialWithIdSchema),
  updateMaterialController
);
materialRoutes.delete(
  "/:id",
  validationSchema(materialIdSchema),
  deleteMaterialController
);
