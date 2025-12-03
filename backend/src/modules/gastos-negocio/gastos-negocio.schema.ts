import { z } from "zod";

export const createGastosNegocioSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    porcentaje: z
      .number()
      .int()
      .min(0, "El porcentaje debe ser un número entero mayor o igual a 0"),
    impuestos: z
      .number()
      .int()
      .min(0, "Los impuestos deben ser un número entero mayor o igual a 0"),
  }),
});

export const updateGastosNegocioSchema = z.object({
  body: createGastosNegocioSchema.shape.body.partial(),
});

export type CreateGastosNegocioDto = z.infer<
  typeof createGastosNegocioSchema
>["body"];
export type UpdateGastosNegocioDto = z.infer<
  typeof updateGastosNegocioSchema
>["body"];
