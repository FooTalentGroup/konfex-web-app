import { z } from "zod";

const estadoPedidoEnum = z.enum([
  "PENDIENTE",
  "EN_PRODUCCION",
  "LISTO",
  "ENTREGADO",
  "CANCELADO",
]);

export const updatePedidoSchema = z.object({
  body: z.object({
    estado: estadoPedidoEnum.optional(),
    pagado: z.boolean().optional(),
    fechaEntregaEstimada: z.string().datetime().optional().nullable(),
    fechaEntregaReal: z.string().datetime().optional().nullable(),
  }),
});

export type UpdatePedidoDto = z.infer<typeof updatePedidoSchema>["body"];

