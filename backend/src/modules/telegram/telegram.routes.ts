import { Router } from "express";

import {
  getChatMessagesController,
  getChatsController,
  getClienteDataFromChatController,
  markChatAsReadController,
  sendMessageToTelegram,
  telegramWebhookController,
} from "./telegram.controller";
import { authMiddleware } from "@/middleware/authMiddleware";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

telegramRoutes.get("/chats", authMiddleware, getChatsController);

telegramRoutes.get("/chats/:chatId/messages", getChatMessagesController);

telegramRoutes.post("/chats/:chatId/messages/read", markChatAsReadController);

telegramRoutes.get("/chats/:chatId/cliente", getClienteDataFromChatController);

telegramRoutes.post("/send", sendMessageToTelegram);

export default telegramRoutes;
