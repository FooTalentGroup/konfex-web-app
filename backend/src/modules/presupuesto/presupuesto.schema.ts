import { z } from "zod";

export const estadoPresupuestoValues = [
  "BORRADOR",
  "ENVIADO",
  "ACEPTADO",
  "RECHAZADO",
  "VENCIDO",
] as const;

export type EstadoPresupuesto = (typeof estadoPresupuestoValues)[number];

export const presupuestoDetalleSchema = z.object({
  productoId: z.number().min(1, { message: "productoId debe ser mayor a 0" }),

  descripcion: z.string().optional(),

  cantidad: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),

  costoUnitario: z.number().min(0, { message: "El costo unitario no puede ser negativo" }),
});

export const createPresupuestoSchema = z.object({
  body: z.object({
    clienteId: z.number().min(1, { message: "clienteId inválido" }).optional().nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues, {
      error: "Estado inválido",
    }),

    margenGananciaPorcentaje: z
      .number()
      .min(0, "El margen debe ser >= 0")
      .max(100, "El margen debe ser <= 100"),

    gastosIndirectosPorcentaje: z
      .number()
      .min(0, "Los gastos indirectos deben ser >= 0")
      .max(100, "Los gastos indirectos deben ser <= 100"),

    totalCosto: z.number().min(0, "totalCosto no puede ser negativo"),

    totalVenta: z.number().min(0, "totalVenta no puede ser negativo"),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
  }),
});

export type CreatePresupuestoRequestDto = z.infer<typeof createPresupuestoSchema>["body"];

export const updatePresupuestoSchema = z.object({
  body: z.object({
    clienteId: z.number().min(1, { message: "clienteId inválido" }).optional().nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues),

    margenGananciaPorcentaje: z.number().min(0).max(100),
    gastosIndirectosPorcentaje: z.number().min(0).max(100),

    totalCosto: z.number().min(0),
    totalVenta: z.number().min(0),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
  }),
});

export type UpdatePresupuestoRequestDto = z.infer<typeof updatePresupuestoSchema>["body"];

export const partialUpdatePresupuestoSchema = z.object({
  body: z.object({
    clienteId: z.number().min(1, { message: "clienteId inválido" }).optional().nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues).optional(),

    margenGananciaPorcentaje: z.number().min(0).max(100).optional(),
    gastosIndirectosPorcentaje: z.number().min(0).max(100).optional(),

    totalCosto: z.number().min(0).optional(),
    totalVenta: z.number().min(0).optional(),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
  }),
});

export type PartialUpdatePresupuestoRequestDto = z.infer<
  typeof partialUpdatePresupuestoSchema
>["body"];
