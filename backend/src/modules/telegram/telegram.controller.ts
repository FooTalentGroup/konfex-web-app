import type { Request, Response } from "express";

import { controllerHandler } from "@/common/handlers";

import {
  getChatMessages,
  getChatsList,
  getClienteDataFromChat,
  handleIncomingUpdate,
} from "./telegram.service";
import { messageReadRepository } from "./message-read.repository";

export const telegramWebhookController = async (req: Request, res: Response) => {
  try {
    // Si usas secret_token, verificar aquí
    // const secret = req.header("X-Telegram-Bot-Api-Secret-Token");
    // if (secret !== process.env.TELEGRAM_SECRET_TOKEN) return res.sendStatus(403);

    const update = req.body; // Telegram envía el update en JSON
    // log para debug
    console.log("Telegram update received:", JSON.stringify(update).slice(0, 2000));

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
  async (req: Request) => {
    // Obtener userId del query param o header (temporal, hasta implementar JWT)
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    return await getChatsList(userId);
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

export const markChatAsReadController = controllerHandler(
  async (req: Request) => {
    const { chatId } = req.params;
    const { userId } = req.body;

    if (!chatId) {
      throw new Error("chatId es requerido");
    }
    if (!userId || typeof userId !== "number") {
      throw new Error("userId es requerido y debe ser un número");
    }

    const result = await messageReadRepository.markChatAsRead(chatId, userId);
    return {
      success: true,
      messagesMarked: result.count,
    };
  },
  "Mensajes marcados como leídos exitosamente",
  200
);

export const getClienteDataFromChatController = controllerHandler(
  async (req: Request) => {
    const { chatId } = req.params;
    if (!chatId) {
      throw new Error("chatId es requerido");
    }
    return await getClienteDataFromChat(chatId);
  },
  "Datos del cliente obtenidos exitosamente",
  200
);
