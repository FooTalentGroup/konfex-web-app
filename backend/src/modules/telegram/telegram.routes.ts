import { Router } from "express";
import { telegramWebhookController } from "./telegram.controller";

const telegramRoutes = Router();

telegramRoutes.post("/webhook", telegramWebhookController);

export default telegramRoutes;
