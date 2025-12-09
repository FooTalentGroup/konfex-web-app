import type { Request, Response } from "express";

import { controllerHandler } from "@/common/handlers";

import {
  getChatMessages,
  getChatsList,
  getClienteDataFromChat,
  handleIncomingUpdate,
  markChatAsRead,
  sendTextMessage,
} from "./telegram.service";

export const telegramWebhookController = async (req: Request, res: Response) => {
  try {

    const update = req.body;
    await handleIncomingUpdate(update);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ ok: false });
  }
};

export const getChatsController = controllerHandler(
  async (req: Request) => {
    const userId = req.user?.id;
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

    if (!chatId) {
      throw new Error("chatId es requerido");
    }

    const result = await markChatAsRead(chatId);

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

export const sendMessageToTelegram = controllerHandler(
  async (req: Request) => {
    const { chatId, text, firstName, lastName, username } = req.body;

    if (!chatId || !text) {
      throw new Error("chatId y text son requeridos");
    }
    const defaultFirstName = firstName || "Konfex";
    const defaultLastName = lastName || "Usuario";
    const defaultUsername = username || null;

    return await sendTextMessage(
      chatId,
      text,
      defaultFirstName,
      defaultLastName,
      defaultUsername
    );
  },
  "Mensaje enviado correctamente",
  200
);
