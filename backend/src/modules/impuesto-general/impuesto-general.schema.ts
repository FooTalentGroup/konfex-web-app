import type { z } from "zod";

export const createImpuestoGeneralSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    porcentaje: z
      .number()
      .int()
      .min(0, "El porcentaje debe ser un número entero mayor o igual a 0"),
  }),
});

export const updateImpuestoGeneralSchema = z.object({
  body: createImpuestoGeneralSchema.shape.body.partial(),
});

export type CreateImpuestoGeneralDto = z.infer<typeof createImpuestoGeneralSchema>["body"];
export type UpdateImpuestoGeneralDto = z.infer<typeof updateImpuestoGeneralSchema>["body"];
