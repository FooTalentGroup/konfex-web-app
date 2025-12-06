import { z } from 'zod'

export const productAPISchema = z.object({
    id: z.number(),
    codigo: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    activo: z.boolean(),
    imagen: z.string().url(),
    tallas: z.array(z.string()),
    colores: z.array(z.string()),
    mermaCantidad: z.number(),
    mermaUnidad: z.string(),
    mermaPrecio: z.number(),
    coleccionId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

export type ProductAPI = z.infer<typeof productAPISchema>

export interface ProductsAPIResponse {
    success: boolean
    statusCode: number
    message: string
    data: ProductAPI[]
}

export interface Product {
    id: number
    codigo: number
    nombre: string
    descripcion: string
    activo: boolean
    imagen: string
    tallas: string[]
    colores: string[]
    mermaCantidad: number
    mermaUnidad: string
    mermaPrecio: number
    coleccionId: number
    createdAt?: string
    updatedAt?: string
}

export interface CreateProductRequest {
    nombre: string
    descripcion?: string
    activo?: boolean
    imagen?: string
    tallas: string[]
    colores: string[]
    mermaCantidad: number
    mermaUnidad: string
    mermaPrecio: number
    coleccionId: number
}

export interface UpdateProductRequest {
    nombre?: string
    descripcion?: string
    activo?: boolean
    imagen?: string
    tallas?: string[]
    colores?: string[]
    mermaCantidad?: number
    mermaUnidad?: string
    mermaPrecio?: number
    coleccionId?: number
}