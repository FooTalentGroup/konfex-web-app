import { Request, Response } from "express";
import { handleIncomingUpdate, getChatsList, getChatMessages, sendMessageToTelegram } from "./telegram.service";
import { controllerHandler } from "@/common/handlers";

export const telegramWebhookController = async (req: Request, res: Response) => {
  try {
    // Si se usa secret_token, verificar aquí
    // const secret = req.header("X-Telegram-Bot-Api-Secret-Token");
    // if (secret !== process.env.TELEGRAM_SECRET_TOKEN) return res.sendStatus(403);

    const update = req.body;
    console.log("Telegram update received:", JSON.stringify(update).slice(0,2000));

    await handleIncomingUpdate(update);

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

export const sendTelegramMessageController = async (req: Request, res: Response) => {
  try {
    const { chatId, text, type, fileUrl, fileName, firstName, lastName, username } = req.body;

    if (!chatId || (!text && !fileUrl)) {
      return res.status(400).json({ error: "chatId y text o fileUrl son requeridos" });
    }

    const result = await sendMessageToTelegram({
      chatId,
      text,
      type,
      fileUrl,
      fileName,
      firstName: firstName || "Konfex",
      lastName: lastName || "Usuario",
      username: username || null,
    });

    return res.json({ ok: true, message: "Mensaje enviado", telegramResponse: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
