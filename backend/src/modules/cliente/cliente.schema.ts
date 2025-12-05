import { z } from "zod";

export const createClienteSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio y no puede estar vacío"),
    telefono: z.string().trim().optional(),
    email: z.string().trim().optional().nullable(),
    origen: z.string().trim().optional(),
    instagramUser: z.string().trim().optional(),
    notas: z.string().trim().optional(),
  }),
});

export const updateClienteSchema = z.object({
  body: createClienteSchema.shape.body.partial(),
});

export type CreateClienteDto = z.infer<typeof createClienteSchema>["body"];
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>["body"];