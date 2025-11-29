import { Router } from "express";
import { telegramWebhookController, getChatsController } from "./telegram.controller";
import { sendTextMessage } from "./telegram.service";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

telegramRoutes.get("/chats", getChatsController);

telegramRoutes.post("/send", async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ error: "chatId y text son requeridos" });
    }

    const result = await sendTextMessage(chatId, text);

    return res.json({
      ok: true,
      message: "Mensaje enviado",
      telegramResponse: result
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


export default telegramRoutes;
