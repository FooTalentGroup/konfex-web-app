import { Router } from "express";

import { validationSchema } from "../../middleware";
import {
  createPresupuestoController,
  deletePresupuestoController,
  getNextNumeroPresupuestoController,
  getPresupuestoByIdController,
  getPresupuestosController,
  partialUpdatePresupuestoController,
  updatePresupuestoController,
} from "./presupuesto.controller";
import {
  createPresupuestoSchema,
  partialUpdatePresupuestoSchema,
  updatePresupuestoSchema,
} from "./presupuesto.schema";

const router = Router();

router.get("/", getPresupuestosController);

router.get("/next-number", getNextNumeroPresupuestoController);

router.post("/", validationSchema(createPresupuestoSchema), createPresupuestoController);

router.get("/:id", getPresupuestoByIdController);

router.put("/:id", validationSchema(updatePresupuestoSchema), updatePresupuestoController);

router.patch(
  "/:id",
  validationSchema(partialUpdatePresupuestoSchema),
  partialUpdatePresupuestoController
);

router.delete("/:id", deletePresupuestoController);

export default router;
