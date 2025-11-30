import { z } from "zod";

// Crear material
export const createMaterialSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "El nombre es obligatorio").max(255),
    url_imagen: z.string().optional().nullable(),
    categoria: z.string().min(1, "La categoría es obligatoria"),
    ancho: z.number().min(0, "El ancho no puede ser negativo"),
    peso: z.number().min(0, "El peso no puede ser negativo"),
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

// Validar parámetros de ruta
export const materialIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "El ID debe ser un número entero")
      .transform(Number),
  }),
});

// DTOs
export type CreateMaterialDto = z.infer<typeof createMaterialSchema>["body"];
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>["body"];
