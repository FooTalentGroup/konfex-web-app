import { z } from "zod";

export const createProductoSchema = z.object({
  body: z.object({
    codigo: z
      .number()
      .int("El código debe ser un número entero")
      .positive("El código debe ser un número positivo"),
    nombre: z.string().trim().min(1, "El nombre no puede estar vacío"),
    descripcion: z.string().optional().nullable(),
    activo: z.boolean().optional().default(true),
    imagen: z.string().url().optional(),
    coleccionId: z.number(),

    tallas: z.array(z.string().trim().min(1)).default([]),
    colores: z.array(z.string().trim().min(1)).default([]),
    materiales: z
      .array(
        z.object({
          materialId: z.number(),
          cantidad: z.number().min(0.0001),
        })
      )
      .default([]),

    mermaCantidad: z.number().optional(),
    mermaUnidad: z.string().trim().min(1).optional(),
    mermaPrecio: z.number().optional(),

    tarifaCosto: z.number().optional(),
    tarifaHoras: z.number().optional(),
    precio: z.number().optional(),
  }),
});

export const updateProductoSchema = z.object({
  body: createProductoSchema.shape.body.partial(),
});

// Schema para búsqueda de productos
export const productoQuerySchema = z.object({
  body: z.object({}).optional(),
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
