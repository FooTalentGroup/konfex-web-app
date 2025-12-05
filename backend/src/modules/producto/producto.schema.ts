import { z } from "zod";

export const createProductoSchema = z.object({
  body: z.object({
    codigo: z
      .string() 
      .trim()
      .min(1, "El código no puede estar vacío")
      .transform(val => parseInt(val, 10)),
    nombre: z.string().trim().min(1, "El nombre no puede estar vacío"),
    descripcion: z.string().optional().nullable(),
    activo: z.boolean().optional().default(true),
    imagen: z.string().url().optional(),
    coleccionId: z.number(),

    tallas: z.array(z.string().trim().min(1)).default([]),
    colores: z.array(z.string().trim().min(1)).default([]),
    materiales: z.array(z.object({
      materialId: z.number(),
      cantidad: z.number().min(0.0001)
    })).default([]),
    manoDeObra: z.array(z.object({
      accionId: z.number(),
      horas: z.number().min(0.1)
    })).default([]),

    wasteMaterial: z.number().optional(),
    wasteUnit: z.string().trim().min(1).optional(),
    wastePrice: z.number().optional()
  })
});

export const updateProductoSchema = z.object({
  body: createProductoSchema.shape.body.partial(),
});

// Schema para búsqueda de productos
export const productoQuerySchema = z.object({
  body: z.object({}),
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
