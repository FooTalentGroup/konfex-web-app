import { z } from "zod";

// ✅ Schemas de validación
export const createClienteSchema = z.object({
  body: z.object({
    nombre: z.string(),
    telefono: z.string().optional(),
    email: z.string().optional().nullable(),
    origen: z.string().optional(),
    instagramUser: z.string().optional(),
    notas: z.string().optional(),
  }),
});

export const updateClienteSchema = z.object({
  body: createClienteSchema.shape.body.partial(), // body obligatorio, campos internos opcionales
});

export type CreateClienteDto = z.infer<typeof createClienteSchema>["body"];
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>["body"];
