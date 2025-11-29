import { Request, Response } from "express";
import { handleIncomingUpdate, getChatsList, getChatMessages } from "./telegram.service";
import { controllerHandler } from "@/common/handlers";

export const telegramWebhookController = async (req: Request, res: Response) => {
  try {
    // Si usas secret_token, verificar aquí
    // const secret = req.header("X-Telegram-Bot-Api-Secret-Token");
    // if (secret !== process.env.TELEGRAM_SECRET_TOKEN) return res.sendStatus(403);

    const update = req.body; // Telegram envía el update en JSON
    // log para debug
    console.log("Telegram update received:", JSON.stringify(update).slice(0,2000));

    // Delegar procesamiento (guardar en DB, notificar frontend, etc.)
    await handleIncomingUpdate(update);

    // Must respond 200 quickly
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ ok: false });
  }
};

export const getChatsController = controllerHandler(
  async () => {
    return await getChatsList();
  },
  "Lista de chats obtenida exitosamente",
  200
);

export const getChatMessagesController = controllerHandler(
  async (req: Request) => {
    const { chatId } = req.params;
    if (!chatId) {
      throw new Error("chatId es requerido");
    }
    return await getChatMessages(chatId);
  },
  "Mensajes del chat obtenidos exitosamente",
  200
);
