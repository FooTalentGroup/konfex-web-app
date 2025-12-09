import { AppError } from "../../common/errors";
import prisma from "../../config/prisma";
import { pedidoRepository } from "./pedido.repository";
import { PedidoUpdateInput } from "./pedido.types";

export const pedidoService = {
  // Obtener todos los pedidos
  getAll: async () => {
    const pedidos = await pedidoRepository.findAll();
    
    // Para cada pedido, obtener el chatId de Telegram del cliente
    const pedidosConChatId = await Promise.all(
      pedidos.map(async (pedido) => {
        // Buscar el primer mensaje de Telegram del cliente para obtener el chatId
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

  // Obtener pedido por ID
  getById: async (id: number) => {
    if (!id || isNaN(id)) {
      throw new AppError("ID inválido", 400);
    }

    const pedido = await pedidoRepository.findById(id);

    if (!pedido) {
      throw new AppError("Pedido no encontrado", 404);
    }

    // Obtener el chatId de Telegram del cliente
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

  // Actualizar pedido
  update: async (id: number, data: PedidoUpdateInput) => {
    await pedidoService.getById(id); // valida existencia
    
    const updated = await pedidoRepository.update(id, data);
    
    // Obtener el chatId de Telegram del cliente
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

