import { z } from "zod";

export const createProductoSchema = z.object({
  body: z.object({
    nombre: z.string(),
    descripcion: z.string().optional().nullable(),
    activo: z.boolean().optional(), // por defecto true
    tallas: z.array(z.string()).optional(),
    colores: z.array(z.string()).optional(),
  }),
});

export const updateProductoSchema = z.object({
  body: createProductoSchema.shape.body.partial(),
});

export type CreateProductoDto = z.infer<typeof createProductoSchema>["body"];
export type UpdateProductoDto = z.infer<typeof updateProductoSchema>["body"];
