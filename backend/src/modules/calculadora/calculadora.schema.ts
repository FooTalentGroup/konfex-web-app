import { z } from "zod";

export const createCalculadoraSchema = z.object({
  body: z.object({
    clienteId: z.number().int().positive(),
    numeroPresupuesto: z.number().int().positive(),
    precioPrendaNeto: z.number().nonnegative(),
    horasTrabajo: z.number().nonnegative(),
    porcentaje: z.number().min(0).max(100),
    gastoAdicional: z.number().nonnegative(),
    gastoEnvio: z.number().nonnegative(),
  }),
});

export const updateCalculadoraSchema = z.object({
  body: createCalculadoraSchema.shape.body.partial(),
});

export type CreateCalculadoraDto = z.infer<
  typeof createCalculadoraSchema
>["body"];
export type UpdateCalculadoraDto = z.infer<
  typeof updateCalculadoraSchema
>["body"];
