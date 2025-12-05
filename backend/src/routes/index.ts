import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import type { Request } from "express";
import { Router } from "express";

import { controllerHandler } from "@/common/handlers";
import prisma from "@/config/prisma";
import { clienteRoutes } from "@/modules/cliente";
import { coleccionRoutes } from "@/modules/colecciones";
import { gastosNegocioRoutes } from "@/modules/gastos-negocio";
import { impuestoGeneralRoutes } from "@/modules/impuesto-general";
import { materialRoutes } from "@/modules/material/material.routes";
import { productoRoutes } from "@/modules/producto/producto.routes";
import telegramRoutes from "@/modules/telegram/telegram.routes";

const router: Router = Router();

// Health check endpoint
router.get(
  "/health",
  controllerHandler(
    async (_req: Request) => {
      // Verificar conexión a la base de datos
      let databaseStatus = "disconnected";
      let databaseLatency = 0;

      try {
        const startTime = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        databaseLatency = Date.now() - startTime;
        databaseStatus = "connected";
      } catch (error) {
        databaseStatus = "error";
        throw error;
      }

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        database: {
          status: databaseStatus,
          latency: `${databaseLatency}ms`,
        },
        version: "1.0.0",
      };
    },
    "Servidor funcionando correctamente",
    200
  )
);

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/clientes", clienteRoutes);
router.use("/materiales", materialRoutes);
router.use("/productos", productoRoutes);
router.use("/colecciones", coleccionRoutes);
router.use("/gastos-negocio", gastosNegocioRoutes);
router.use("/impuesto-general", impuestoGeneralRoutes);
router.use("/telegram", telegramRoutes);

export default router;
