import { Router } from "express";
import { telegramWebhookController, getChatsController, getChatMessagesController, sendTelegramMessageController } from "./telegram.controller";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

telegramRoutes.get("/chats", getChatsController);

telegramRoutes.get("/chats/:chatId/messages", getChatMessagesController);

telegramRoutes.post("/send", sendTelegramMessageController);


export default telegramRoutes;
