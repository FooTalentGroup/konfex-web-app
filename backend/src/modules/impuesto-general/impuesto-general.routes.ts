import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  createImpuestoGeneralController,
  deleteImpuestoGeneralController,
  getAllImpuestoGeneralController,
  getImpuestoGeneralActivoController,
  getImpuestoGeneralByIdController,
  updateImpuestoGeneralController,
} from "./impuesto-general.controller";
import {
  createImpuestoGeneralSchema,
  updateImpuestoGeneralSchema,
} from "./impuesto-general.schema";

export const impuestoGeneralRoutes = Router();

// Obtener el impuesto activo (endpoint especial)
impuestoGeneralRoutes.get("/activo", getImpuestoGeneralActivoController);

// CRUD estándar
impuestoGeneralRoutes.get("/", getAllImpuestoGeneralController);
impuestoGeneralRoutes.get("/:id", getImpuestoGeneralByIdController);

impuestoGeneralRoutes.post(
  "/",
  validationSchema(createImpuestoGeneralSchema),
  createImpuestoGeneralController,
);

impuestoGeneralRoutes.put(
  "/:id",
  validationSchema(updateImpuestoGeneralSchema),
  updateImpuestoGeneralController,
);

impuestoGeneralRoutes.delete("/:id", deleteImpuestoGeneralController);

