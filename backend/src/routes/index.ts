import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import { clienteRoutes } from "@/modules/cliente";
import { materialRoutes } from "@/modules/material/material.routes";
import { productoRoutes } from "@/modules/producto/producto.routes";
import telegramRoutes from "@/modules/telegram/telegram.routes";
import { gastosNegocioRoutes } from "@/modules/gastos-negocio";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/clientes", clienteRoutes);
router.use("/materiales", materialRoutes);
router.use("/productos", productoRoutes);
router.use("/gastos-negocio", gastosNegocioRoutes);
router.use("/telegram", telegramRoutes);

export default router;
