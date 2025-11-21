import { z } from "zod";

// Helper que mantiene el tipo number | undefined
const numericField = z
  .union([z.string(), z.number(), z.undefined(), z.null()])
  .transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = typeof val === 'number' ? val : Number(val);
    return isNaN(num) ? undefined : num;
  })
  .pipe(z.number().optional());

export const BudgetSchema = z.object({
  // General Information
  title: z.string(),
  clientName: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.string(),
  finishDate: z.string().optional(),
  profitabilityPercentage: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'number' ? val : Number(val);
      return isNaN(num) ? 0 : num;
    })
    .pipe(z.number().min(0).max(100, "La rentabilidad debe ser entre 0% y 100%")),
  saveInfo: z.boolean().optional(),

  // Labor
  laborOrder: z.string().optional(),
  laborRate: numericField,
  laborHours: numericField,
  laborTotal: numericField,

  // Materials
  materialName: z.string().optional(),
  materialSize: z.string().optional(),
  materialQuantity: numericField,
  materialPrice: numericField,
  materialsCost: numericField,
  additionalCost: z.string().optional(),
  
  // Indirect Materials
  indirectMaterialName: z.string().optional(),
  indirectMaterialCost: numericField,

  // Miscellaneous indirect costs
  electricityCost: numericField,
  waterCost: numericField,
  shippingCost: numericField,
  otherIndirectCosts: numericField,
});

export type BudgetFormData = z.infer<typeof BudgetSchema>;