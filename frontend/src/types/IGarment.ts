import { z } from 'zod';

export const GarmentSchema = z.object({

    // Cargar Imagen
    image: z
        .string()
        .min(1, 'La imagen es requerida'),

    // Información General
    id: z.string().optional(),
    season: z.string().optional(),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    

    // Detalles de Prenda
    commercialName: z.string().min(1, 'El nombre comercial es obligatorio'),
    description: z.string().optional(),
    sizes: z.array(z.string()).min(1, 'Selecciona al menos una talla'),
    colors: z.array(z.string()).min(1, 'Selecciona al menos un color'),

    // Materia Prima

    // Producción

});


export type GarmentFormData = z.infer<typeof GarmentSchema>;