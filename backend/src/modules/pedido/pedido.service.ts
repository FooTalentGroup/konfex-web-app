import { AppError } from "../../common/errors";
import prisma from "../../config/prisma";
import { pedidoRepository } from "./pedido.repository";
import type { PedidoUpdateInput } from "./pedido.types";

export const pedidoService = {
  getAll: async () => {
    const pedidos = await pedidoRepository.findAll();

    const pedidosConChatId = await Promise.all(
      pedidos.map(async (pedido) => {
        const telegramMessage = await prisma.telegramMessage.findFirst({
          where: { clienteId: pedido.clienteId },
          select: { chatId: true },
          orderBy: { timestamp: "asc" },
        });

        return {
          ...pedido,
          telegramChatId: telegramMessage?.chatId || null,
        };
      })
    );

    return pedidosConChatId;
  },

  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const pedido = await pedidoRepository.findById(id);

    if (!pedido) {
      throw new AppError("Pedido no encontrado", 404);
    }

    const telegramMessage = await prisma.telegramMessage.findFirst({
      where: { clienteId: pedido.clienteId },
      select: { chatId: true },
      orderBy: { timestamp: "asc" },
    });

    return {
      ...pedido,
      telegramChatId: telegramMessage?.chatId || null,
    };
  },

  update: async (id: number, data: PedidoUpdateInput) => {
    await pedidoService.getById(id);

    const updated = await pedidoRepository.update(id, data);

    const telegramMessage = await prisma.telegramMessage.findFirst({
      where: { clienteId: updated.clienteId },
      select: { chatId: true },
      orderBy: { timestamp: "asc" },
    });

    return {
      ...updated,
      telegramChatId: telegramMessage?.chatId || null,
    };
  },
};
