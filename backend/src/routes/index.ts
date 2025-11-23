import { Router, Request, Response } from "express";
import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import { sendSuccess } from "@/common/responses";

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

// Auth routes
router.use("/auth", authRoutes);

// Presupuesto routes
router.use("/presupuestos", presupuestoRoutes);

export default router;
