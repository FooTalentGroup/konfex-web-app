import { z } from "zod";

export const BudgetSchema = z.object({
  // General Information
  title: z.string().min(2, "El título es obligatorio"),
  clientName: z.string().min(1, "El nombre del cliente es requerido"),
  clientId: z.string().optional(),
  startDate: z.string().optional(), 
  finishDate: z.string().min(1, "La fecha de finalización es requerida"),
  profitabilityPercentage: z
    .number({ error: "Debe ser un número",
    })
    .min(0, "Debe ser mayor o igual a 0")
    .max(100, "No puede pasar del 100"),

  saveInfo: z.boolean().optional(),

  // Labor
  laborOrder: z.string().min(1, "La orden de producción es requerida"),
  laborRate: z
    .number({ error: "Debe ser un número" })
    .min(0, "Debe ser mayor o igual a 0")
    .optional(),
  laborHours: z.number().min(0, "Debe ser mayor o igual a 0").max(24, "Máximo 24 horas").optional(),

  // Materials
  materialName: z.string().min(2, "Nombre requerido"),
  materialSize: z.string().min(1, "La talla es requerida"),
  materialQuantity: z.number().min(0, "Debe ser mayor o igual a 0").optional(),
  materialPrice: z.number({ error: "Debe ser un número" }).min(0, "Debe ser mayor o igual a 0").optional(),
  additionalCost: z.string().optional(),
  materialsCost: z.number({ error: "Debe ser un número" }).min(0, "Debe ser mayor o igual a 0").optional(),
  
});

export type BudgetFormData = z.infer<typeof BudgetSchema>;