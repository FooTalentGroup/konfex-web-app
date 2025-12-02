import { z } from "zod";

// Crear material
export const createMaterialSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es obligatorio").max(255),
    url_imagen: z.string().optional().nullable(),
    categoria: z.string().min(1, "La categoría es obligatoria"),
    unidadMedida: z.string().min(1, "La unidad de medida es obligatoria"),
    ancho: z.number().min(0, "El ancho no puede ser negativo").optional().nullable(),
    peso: z.number().min(0, "El peso no puede ser negativo").optional().nullable(),
    colores: z.array(z.string().min(1)).min(1, "Debe tener al menos un color"),
    proveedor: z.string().min(1, "El proveedor es obligatorio"),
    precio: z.number().min(0, "El precio no puede ser negativo"),
    stock: z.number().min(0, "El stock no puede ser negativo"),
  }),
});

// Actualizar material
export const updateMaterialSchema = z.object({
  body: createMaterialSchema.shape.body.partial(),
});

// Schema combinado para actualizar (body + params)
export const updateMaterialWithIdSchema = z.object({
  body: createMaterialSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número entero").transform(Number),
  }),
});

// Validar parámetros de ruta (ID)
export const materialIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número entero").transform(Number),
  }),
});

// Query params (filtros)
export const materialQuerySchema = z.object({
  query: z.object({
    categoria: z.string().optional(),
    color: z.string().optional(),
    precioMin: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    precioMax: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    pesoMin: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    pesoMax: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    anchoMin: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    anchoMax: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .optional()
      .transform((val) => (val ? parseFloat(val) : undefined)),
    proveedor: z.string().optional(),
    search: z.string().optional(), // Búsqueda por nombre
    page: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    sortBy: z.enum(["nombre", "precio", "peso", "ancho", "categoria", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

// DTOs
export type CreateMaterialDto = z.infer<typeof createMaterialSchema>["body"];
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>["body"];
export type MaterialQueryDto = z.infer<typeof materialQuerySchema>["query"];
