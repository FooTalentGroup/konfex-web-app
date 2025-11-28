import { Router, Request, Response } from "express";
import authRoutes from "@modules/auth/auth.routes";
import presupuestoRoutes from "@modules/presupuesto/presupuesto.routes";
import { sendSuccess } from "@/common/responses";
import { clienteRoutes } from "@/modules/cliente";
import { materialRoutes } from "@modules/material/material.routes";
import { productoRoutes } from "@modules/producto/producto.routes";
import { emitTelegramMessage } from "@/utils/telegramSocket";

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

router.post("/telegram/test-message", (req: Request, res: Response) => {
  const { chatId, text } = req.body;
  
  if (!chatId || !text) {
    return sendSuccess(res, {
      statusCode: 400,
      message: "chatId y text son requeridos",
    });
  }

  emitTelegramMessage({
    chatId: chatId.toString(),
    text: text,
    source: 'telegram',
    firstName: 'Usuario',
    lastName: 'Prueba',
    username: 'test_user',
    timestamp: new Date().toISOString(),
  });

  sendSuccess(res, {
    message: "Mensaje de prueba emitido vía Socket.IO",
    data: {
      chatId,
      text,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
