import { Router, Request, Response } from "express";
import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import { sendSuccess } from "@/common/responses";
import { clienteRoutes } from "@/modules/cliente";
import { materialRoutes } from "@modules/material/material.routes";
import { productoRoutes } from "@modules/producto/producto.routes";

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

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/clientes", clienteRoutes);
router.use("/materiales", materialRoutes);
router.use("/productos", productoRoutes);

export default router;
