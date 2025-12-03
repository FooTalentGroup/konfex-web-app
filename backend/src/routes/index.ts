import { Router, Request, Response } from "express";
import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import { sendSuccess } from "@/common/responses";
import { clienteRoutes } from "@/modules/cliente";
import { materialRoutes } from "@/modules/material/material.routes";
import { productoRoutes } from "@/modules/producto/producto.routes";
import telegramRoutes from "@/modules/telegram/telegram.routes";
import { calculadoraRoutes } from "@/modules/calculadora";

const router: Router = Router();

router.get("/health", (_req: Request, res: Response) => {
  sendSuccess(res, {
    message: "Servidor operativo",
    data: {
      status: "OK",
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth
router.use("/auth", authRoutes);

// Presupuesto
router.use("/presupuestos", presupuestoRoutes);

// Clientes
router.use("/clientes", clienteRoutes);

// Materiales
router.use("/materiales", materialRoutes);

// Productos
router.use("/productos", productoRoutes);

// Telegram
router.use("/telegram", telegramRoutes);

// Calculadora
router.use("/calculadoras", calculadoraRoutes);

export default router;
