import { z } from 'zod'

export const fabricSchema = z.object({
    image: z
        .string()
        .min(1, 'La imagen es requerida'),

    category: z
        .string()
        .min(1, 'La categoría es requerida')
        .min(2, 'La categoría debe tener al menos 2 caracteres'),

    material: z
        .string()
        .min(1, 'El material es requerido')
        .min(2, 'El material debe tener al menos 2 caracteres'),

    size: z
        .number({ error: 'El tamaño debe ser un número' })
        .min(1, 'El tamaño es requerido'),

    weight: z
        .number({ error: 'El peso debe ser un número' })
        .min(1, 'El peso es requerido'),

    colors: z
        .string()
        .min(1, 'Los colores son requeridos')
        .min(2, 'Debe especificar al menos un color'),

    supplier: z
        .string()
        .min(1, 'El proveedor es requerido')
        .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres'),

    totalPrice: z
        .number({ error: 'El precio debe ser un número' })
        .min(1, 'El precio es requerido')
        .refine((val) => !isNaN(Number(val)), 'Debe ser un número válido')
        .refine((val) => Number(val) > 0, 'El precio debe ser mayor a 0')
})

export type FabricFormData = z.infer<typeof fabricSchema>

// export interface FabricFormData {
//     category: string
//     material: string
//     size: string
//     weight: string
//     colors: string
//     supplier: string
//     totalPrice: string
// }