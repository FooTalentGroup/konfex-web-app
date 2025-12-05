import { z } from "zod";

export const createCategoriaSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(255),
  }),
});

export const updateCategoriaSchema = z.object({
  body: createCategoriaSchema.shape.body.partial(),
});

export type CreateCategoriaDto = z.infer<
  typeof createCategoriaSchema
>["body"];
export type UpdateCategoriaDto = z.infer<
  typeof updateCategoriaSchema
>["body"];

