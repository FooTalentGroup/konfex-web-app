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

export const adicionalSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  cantidad: z
    .number()
    .int()
    .min(1, { message: "La cantidad debe ser mayor a 0" }),
  monto: z
    .number()
    .min(0, { message: "El monto no puede ser negativo" }),
  totalCosto: z
    .number()
    .min(0, { message: "El total costo no puede ser negativo" }),
  tarifaEnvio: z
    .number()
    .min(0, { message: "La tarifa de envío no puede ser negativa" })
    .optional(),
  observaciones: z.string().optional(),
});

export const createPresupuestoSchema = z.object({
  body: z.object({
    nombre: z.string().optional(),
    clienteId: z
      .number()
      .min(1, { message: "clienteId inválido" })
      .optional()
      .nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues, {
      error: "Estado inválido",
    }),

    margenGananciaPorcentaje: z
      .number()
      .min(0, "El margen debe ser >= 0")
      .max(100, "El margen debe ser <= 100"),

    gastosNegocioId: z
      .number()
      .min(1, { message: "gastosNegocioId debe ser mayor a 0" }),

    totalCosto: z.number().min(0, "totalCosto no puede ser negativo"),

    costosIndirectos: z
      .number()
      .min(0, "costosIndirectos no puede ser negativo"),

    ganancias: z
      .number()
      .min(0, "ganancias no puede ser negativo"),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
    adicionales: z.array(adicionalSchema).optional(),
  }),
});

export type CreatePresupuestoRequestDto = z.infer<typeof createPresupuestoSchema>["body"];

export const updatePresupuestoSchema = z.object({
  body: z.object({
    nombre: z.string().optional(),
    clienteId: z
      .number()
      .min(1, { message: "clienteId inválido" })
      .optional()
      .nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues),

    margenGananciaPorcentaje: z.number().min(0).max(100),
    gastosNegocioId: z.number().min(1),

    totalCosto: z.number().min(0),
    costosIndirectos: z.number().min(0),
    ganancias: z.number().min(0),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
    adicionales: z.array(adicionalSchema).optional(),
  }),
});

export type UpdatePresupuestoRequestDto = z.infer<typeof updatePresupuestoSchema>["body"];

export const partialUpdatePresupuestoSchema = z.object({
  body: z.object({
    nombre: z.string().optional(),
    clienteId: z
      .number()
      .min(1, { message: "clienteId inválido" })
      .optional()
      .nullable(),

    fechaVencimiento: z.string().datetime("Formato de fecha inválido").optional(),

    estado: z.enum(estadoPresupuestoValues).optional(),

    margenGananciaPorcentaje: z.number().min(0).max(100).optional(),
    gastosNegocioId: z.number().min(1).optional(),

    totalCosto: z.number().min(0).optional(),
    costosIndirectos: z.number().min(0).optional(),
    ganancias: z.number().min(0).optional(),

    notas: z.string().optional(),

    detalles: z.array(presupuestoDetalleSchema).optional(),
    adicionales: z.array(adicionalSchema).optional(),
  }),
});

export type PartialUpdatePresupuestoRequestDto = z.infer<
  typeof partialUpdatePresupuestoSchema
>["body"];
