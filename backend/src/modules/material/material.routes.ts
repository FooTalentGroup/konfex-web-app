import { Router } from "express";
import { createMaterialSchema, updateMaterialSchema } from "./material.schema";
import { validationSchema } from "@/middleware";
import { createMaterialController, deleteMaterialController, getAllMaterialsController, getMaterialByIdController, updateMaterialController } from "./material.controller";

export const materialRoutes = Router();

materialRoutes.get("/", getAllMaterialsController);
materialRoutes.get("/:id", getMaterialByIdController);

materialRoutes.post("/", validationSchema(createMaterialSchema), createMaterialController);
materialRoutes.put("/:id", validationSchema(updateMaterialSchema), updateMaterialController);
materialRoutes.delete("/:id", deleteMaterialController);
