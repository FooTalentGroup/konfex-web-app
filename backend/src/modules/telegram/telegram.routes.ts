import { Router } from "express";

import { authMiddleware } from "@/middleware/authMiddleware";

import {
  getChatMessagesController,
  getChatsController,
  getClienteDataFromChatController,
  markChatAsReadController,
  sendMessageToTelegram,
  telegramWebhookController,
} from "./telegram.controller";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

telegramRoutes.get("/chats", authMiddleware, getChatsController);

telegramRoutes.get("/chats/:chatId/messages", getChatMessagesController);

telegramRoutes.post("/chats/:chatId/messages/read", markChatAsReadController);

telegramRoutes.get("/chats/:chatId/cliente", getClienteDataFromChatController);

telegramRoutes.post("/send", sendMessageToTelegram);

export default telegramRoutes;
