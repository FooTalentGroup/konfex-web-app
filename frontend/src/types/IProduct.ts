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
    precio: z.number(),
    mermaCantidad: z.number(),
    mermaUnidad: z.string(),
    mermaPrecio: z.number(),
    coleccionId: z.number(),
    tarifaCosto: z.number(),
    tarifaHoras: z.number(),
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
    id:                  number;
    codigo:              number;
    nombre:              string;
    descripcion:         string;
    activo:              boolean;
    imagen:              string;
    tallas:              string[];
    colores:             string[];
    mermaCantidad:       number;
    mermaUnidad:         string;
    mermaPrecio:         number;
    tarifaCosto:         number;
    tarifaHoras:         number;
    precio:              number;
    coleccionId:         number;
    createdAt:           Date;
    updatedAt:           Date;
    coleccion:           Coleccion;
    materiales:          Materiales[];
    pedidos:             Pedido[];
    presupuestoDetalles: PresupuestoDetalle[];
}

export interface CreateProductRequest {
    nombre: string
    descripcion?: string
    activo?: boolean
    imagen?: string
    tallas: string[]
    colores: string[]
    precio: number
    mermaCantidad: number
    mermaUnidad: string
    mermaPrecio: number
    coleccionId: number
    tarifaCosto?: number
    tarifaHoras?: number
    materiales?: {
        materialId: number
        cantidad: number
    }[]
}

export interface UpdateProductRequest {
    nombre?: string
    descripcion?: string
    activo?: boolean
    imagen?: string
    tallas?: string[]
    colores?: string[]
    precio?: number
    mermaCantidad?: number
    mermaUnidad?: string
    mermaPrecio?: number
    coleccionId?: number
    tarifaCosto?: number
    tarifaHoras?: number
    materiales?: {
        materialId: number
        cantidad: number
    }[]

}

export interface Collection {
    id:        number;
    codigo:    number;
    nombre:    string;
    imagen:    null | string;
    icono:     null | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MaterialProduct {
    id:         number;
    productoId: number;
    materialId: number;
    cantidad:   number;
    material:   Material;
}

export interface Material {
    id:           number;
    nombre:       string;
    url_imagen:   null;
    categoriaId:  number;
    unidadMedida: string;
    ancho:        number | null;
    peso:         number | null;
    colores:      string[];
    proveedor:    string;
    precio:       number;
    createdAt:    Date;
    updatedAt:    Date;
}


export interface OrderItem {
    id:             number;
    pedidoId:       number;
    productoId:     number;
    cantidad:       number;
    talle:          string;
    color:          string;
    costoUnitario:  number;
    precioUnitario: number;
    subtotal:       number;
}

export interface BudgetDetail {
    id:            number;
    presupuestoId: number;
    productoId:    number;
    descripcion:   string;
    cantidad:      number;
    costoUnitario: number;
}
