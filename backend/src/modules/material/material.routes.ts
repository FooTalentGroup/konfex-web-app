import { Router } from "express";
import {
  createMaterialSchema,
  materialQuerySchema,
  materialIdSchema,
  updateMaterialSchema,
} from "./material.schema";
import { validationSchema } from "@/middleware";
import {
  createMaterialController,
  deleteMaterialController,
  getAllMaterialsController,
  getMaterialByIdController,
  updateMaterialController,
} from "./material.controller";

export const materialRoutes = Router();

materialRoutes.get(
  "/",
  validationSchema(materialQuerySchema as any),
  getAllMaterialsController,
);
materialRoutes.get(
  "/:id",
  validationSchema(materialIdSchema as any),
  getMaterialByIdController,
);

materialRoutes.post(
  "/",
  validationSchema(createMaterialSchema),
  createMaterialController,
);
materialRoutes.put(
  "/:id",
  validationSchema(updateMaterialSchema),
  validationSchema(materialIdSchema as any),
  updateMaterialController,
);
materialRoutes.delete(
  "/:id",
  validationSchema(materialIdSchema as any),
  deleteMaterialController,
);
