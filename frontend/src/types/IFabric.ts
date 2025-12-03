import { z } from 'zod'

const textOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,-]+$/

export const fabricSchema = z.object({
    image: z
        .string()
        .min(1, 'La imagen es requerida'),

    material: z
        .string()
        .min(1, 'El material es requerido')
        .min(2, 'El material debe tener al menos 2 caracteres')
        .max(100, 'El material debe tener menos de 50 caracteres')
        .refine((val) => textOnlyRegex.test(val), {
            message: 'El material solo puede contener letras, espacios, comas y guiones'
        }),
    
    rollWidth: z
        .number({
            error: 'El ancho del rollo debe ser un número'
         })
        .positive('Debe ser mayor a 0')
        .max(1000, 'El ancho de rollo debe ser menor o igual a 1000')
        .refine((val) => val > 0, { message: 'El ancho debe ser mayor a 0' }),

    rollWidthUnit: z
        .enum(['m', 'cm', 'yds'])
        .default('m')
        .catch('m')
        .refine((val) => ['m', 'cm', 'yds'].includes(val), {
            message: 'Selecciona una unidad válida'
        }),

    weight: z
        .number({ error: 'Debe ser un número válido' })
        .positive('Debe ser mayor a 0')
        .max(10000, 'El peso no puede ser mayor a 10000')
        .refine((val) => val > 0, { message: 'El peso debe ser mayor a 0' }),

    weightUnit: z
        .enum(['gr/m2', 'kg/m2', 'oz/yd2'])
        .default('gr/m2')
        .catch('gr/m2')
        .refine((val) => ['gr/m2', 'kg/m2', 'oz/yd2'].includes(val), {
            message: 'Selecciona una unidad válida'
        }),

    colors: z
        .string()
        .min(1, 'Los colores son requeridos')
        .min(2, 'Debe especificar al menos un color')
        .max(200, 'Los colores deben tener menos de 200 caracteres')
        .refine((val) => textOnlyRegex.test(val), {
            message: 'Los colores solo pueden contener letras, espacios, comas y guiones'
        }),

    supplier: z
        .string()
        .min(1, 'El proveedor es requerido')
        .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres')
        .max(100, 'El nombre del proveedor debe tener menos de 100 caracteres')
        .refine((val) => textOnlyRegex.test(val), {
            message: 'El nombre del proveedor solo puede contener letras y espacios'
        }),


    totalPrice: z
        .number({ error: 'El precio debe ser un número' })
        .min(1, 'El precio es requerido')
        .positive('El precio debe ser mayor a 0')
        .refine((val) => !isNaN(Number(val)), 'Debe ser un número válido')
        .refine((val) => Number(val) > 0, 'El precio debe ser mayor a 0')
})

export type FabricFormData = z.infer<typeof fabricSchema>

export interface MaterialAPIRequest {
    nombre: string
    url_imagen: string
    categoria: string
    unidadMedida: string
    ancho: number
    peso: number
    colores: string[]
    proveedor: string
    precio: number
    stock: number
}

export interface MaterialAPIResponse {
    id: string
    nombre: string
    url_imagen: string
    categoria: string
    unidadMedida: string
    ancho: number
    peso: number
    colores: string[]
    proveedor: string
    precio: number
    stock: number
    createdAt?: string
    updatedAt?: string
}