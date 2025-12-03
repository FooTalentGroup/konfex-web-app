import { Router } from "express";
import type { ZodSchema } from "zod";

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
  validationSchema(materialQuerySchema as ZodSchema<{ body: object; query: object }>),
  getAllMaterialsController
);
materialRoutes.get(
  "/:id",
  validationSchema(materialIdSchema as ZodSchema<{ body: object; params: object }>),
  getMaterialByIdController
);

materialRoutes.post("/", validationSchema(createMaterialSchema), createMaterialController);
materialRoutes.put(
  "/:id",
  validationSchema(updateMaterialWithIdSchema as ZodSchema<{ body: object; params: object }>),
  updateMaterialController
);
materialRoutes.delete(
  "/:id",
  validationSchema(materialIdSchema as ZodSchema<{ body: object; params: object }>),
  deleteMaterialController
);
