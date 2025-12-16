import { z } from 'zod';

const textOnlyRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s,-]+$/

export const GarmentSchema = z.object({

    image: z
        .string({ error: 'La imagen es requerida' })
        .min(1, 'La imagen es requerida'),

    id: z.number().optional(),
    season: z.string().optional(),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),


    commercialName: z.string().min(1, 'El nombre comercial es obligatorio')
        .max(100, 'El nombre comercial debe tener menos de 100 caracteres')
        .refine((val) => textOnlyRegex.test(val), {
            message: 'El nombre comercial solo puede contener letras, espacios, comas y guiones'
        })
    ,
    description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
    sizes: z.string().min(1, 'Las tallas son requeridas'),
    colors: z.string().min(1, 'Los colores son requeridos'),

    rawMaterials: z.array(z.object({
        id: z.string().optional(),
        type: z.enum(['fabric', 'supply']).optional(),
        name: z.string().optional(),
        consumption: z.number().positive('El consumo debe ser mayor a 0').optional(),
        unit: z.string(),
        price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
    })).default([])
        .optional()
        .refine(
            (materials) => !materials || materials.length > 0,
            'Debes agregar al menos un material (tela o insumo)'
        ),

    tempFabricName: z.string().optional(),
    tempFabricConsumption: z.number({ error: 'El consumo debe ser un número' }).optional(),
    tempFabricUnit: z.string().optional(),
    tempFabricPrice: z.number({ error: 'El precio debe ser un número' }).min(0, 'El precio debe ser mayor o igual a 0').optional(),

    tempSupplyName: z.string().optional(),
    tempSupplyConsumption: z.number({ error: 'El consumo debe ser un número' }).optional(),
    tempSupplyUnit: z.string().optional(),
    tempSupplyPrice: z.number({ error: 'El precio debe ser un número' }).min(0, 'El precio debe ser mayor o igual a 0').optional(),


    laborRate: z.number({ error: 'La tarifa debe ser un número' }).min(0, 'La tarifa debe ser mayor o igual a 0').optional(),
    laborHours: z.number({ error: 'Las horas deben ser un número' }).min(0, 'Las horas deben ser mayor o igual a 0').optional(),
    wasteMaterial: z.number({ error: 'La merma debe ser un número' }).min(0, 'La merma debe ser mayor o igual a 0').optional(),
    wasteUnit: z.string().optional(),
    wastePrice: z.number({ error: 'El precio debe ser un número' }).min(0, 'El precio debe ser mayor o igual a 0').optional(),

});


export type GarmentFormData = z.infer<typeof GarmentSchema>;

export interface CreateGarmentPayload {
    codigo: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    imagen: string;
    tallas: string[];
    colores: string[];
    precio: number;

    coleccionId: number;

    materiales?: Array<{
        materialId: number;
        cantidad: number;
    }>;

    tarifaCosto?: number;
    tarifaHoras?: number;

    mermaCantidad?: number;
    mermaUnidad?: string;
    mermaPrecio?: number;
}

export interface RawMaterial {
    materialId: number;
    nombre: string;
    cantidad: number;
    unidadMedida: string;
    precioTotal: number;
}
