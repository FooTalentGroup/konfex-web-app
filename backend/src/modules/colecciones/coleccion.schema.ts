import { z } from "zod";

export const createColeccionSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio y no puede estar vacío"),

    imagen: z
      .string()
      .trim()
      .url("La imagen debe ser una URL válida")
      .optional(),

    icono: z
      .string()
      .trim()
      .url("El icono debe ser una URL válida")
      .optional(),
  }),
});

export const updateColeccionSchema = z.object({
  body: createColeccionSchema.shape.body.partial(),
});

export type CreateColeccionDto = z.infer<typeof createColeccionSchema>["body"];
export type UpdateColeccionDto = z.infer<typeof updateColeccionSchema>["body"];
