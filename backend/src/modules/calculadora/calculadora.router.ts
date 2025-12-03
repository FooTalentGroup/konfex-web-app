import { Router } from "express";
import {
  createCalculadoraController,
  deleteCalculadoraController,
  getAllCalculadorasController,
  getCalculadoraByIdController,
  updateCalculadoraController,
} from "./calculadora.controller";
import {
  createCalculadoraSchema,
  updateCalculadoraSchema,
} from "./calculadora.schema";
import { validationSchema } from "../../middleware";

export const calculadoraRoutes = Router();

calculadoraRoutes.get("/", getAllCalculadorasController);
calculadoraRoutes.get("/:id", getCalculadoraByIdController);
calculadoraRoutes.post(
  "/",
  validationSchema(createCalculadoraSchema),
  createCalculadoraController,
);
calculadoraRoutes.put(
  "/:id",
  validationSchema(updateCalculadoraSchema),
  updateCalculadoraController,
);
calculadoraRoutes.delete("/:id", deleteCalculadoraController);

export default calculadoraRoutes;
