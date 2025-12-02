import { Router } from "express";

import {
  getChatMessagesController,
  getChatsController,
  telegramWebhookController,
} from "./telegram.controller";
import { sendTextMessage } from "./telegram.service";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

telegramRoutes.get("/chats", getChatsController);

telegramRoutes.get("/chats/:chatId/messages", getChatMessagesController);

telegramRoutes.post("/send", async (req, res) => {
  try {
    const { chatId, text, firstName, lastName, username } = req.body as {
      chatId?: string | number;
      text?: string;
      firstName?: string;
      lastName?: string;
      username?: string;
    };

    if (!chatId || !text) {
      return res.status(400).json({ error: "chatId y text son requeridos" });
    }

    // Si no se proporcionan firstName, lastName, username, usar valores por defecto
    const defaultFirstName = firstName || "Konfex";
    const defaultLastName = lastName || "Usuario";
    const defaultUsername = username || "";

    const result = await sendTextMessage(
      chatId,
      text,
      defaultFirstName,
      defaultLastName,
      defaultUsername
    );

    return res.json({
      ok: true,
      message: "Mensaje enviado",
      telegramResponse: result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default telegramRoutes;
