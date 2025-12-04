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

// Schema para búsqueda de productos
export const productoQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
  }),
});

export type CreateProductoDto = z.infer<typeof createProductoSchema>["body"];
export type UpdateProductoDto = z.infer<typeof updateProductoSchema>["body"];
export type ProductoQueryDto = z.infer<typeof productoQuerySchema>["query"];
