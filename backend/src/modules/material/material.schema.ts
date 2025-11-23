import { z } from "zod";

// Crear material
export const createMaterialSchema = z.object({
  body: z.object({
    nombre: z.string(),
    costoUnitario: z.number(),
    unidadMedida: z.string(),
    stock: z.number(),
    tipo: z.string().optional(),
  }),
});

// Actualizar material
export const updateMaterialSchema = z.object({
  body: createMaterialSchema.shape.body.partial(),
});

// DTOs
export type CreateMaterialDto = z.infer<typeof createMaterialSchema>["body"];
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>["body"];
