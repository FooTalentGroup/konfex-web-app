import { z } from 'zod'

export const collectionAPISchema = z.object({
    id: z.number(),
    codigo: z.number(),
    nombre: z.string(),
    imagen: z.string().url(),
    icono: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

export type CollectionAPI = z.infer<typeof collectionAPISchema>

export interface CollectionsAPIResponse {
    success: boolean
    statusCode: number
    message: string
    data: CollectionAPI[]
}

export interface Collection {
    id: number
    nombre: string
    codigo: number
    imagen: string
    icono: string
    createdAt?: string
    updatedAt?: string
}

export interface CreateCollectionRequest {
    nombre: string
    imagen?: string
    icono?: string
}

export interface UpdateCollectionRequest {
    nombre?: string
    imagen?: string
    icono?: string
}