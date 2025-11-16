import { Router, Request, Response } from "express";
import authRoutes from "@modules/auth/auth.routes"
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

// User routes
router.use("/auth", authRoutes);

export default router;
