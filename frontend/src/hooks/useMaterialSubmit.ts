import { useState } from 'react'
import { FabricFormData, MaterialAPIRequest, MaterialAPIResponse } from '@/types/IFabric'
import { materialService } from '@/services/material.service'

type OperationType = 'create' | 'update' | 'delete'

interface UseMaterialSubmitOptions {
    onSuccess?: (material: MaterialAPIResponse, operation: OperationType) => void
    onError?: (error: Error, operation: OperationType) => void
}

export function useMaterialSubmit(options?: UseMaterialSubmitOptions) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const transformFormDataToAPIRequest = (formData: FabricFormData): MaterialAPIRequest => {

        const coloresArray = formData.colors
            .split(',')
            .map(color => color.trim())
            .filter(color => color.length > 0);

        const unidadMedidaMap: Record<string, string> = {
            'm': 'metros',
            'cm': 'centímetros',
            'yds': 'yardas'
        }

        const unidadMedida = unidadMedidaMap[formData.rollWidthUnit]
        
        return {
            nombre: formData.material,
            url_imagen: formData.image,
            categoria: 'Tela',
            unidadMedida: unidadMedida || 'metros',
            ancho: formData.rollWidth,
            peso: formData.weight,
            colores: coloresArray,
            proveedor: formData.supplier,
            precio: formData.totalPrice,
        }
    }

    const createMaterial = async (formData: FabricFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const apiRequest = transformFormDataToAPIRequest(formData)
            const material = await materialService.create(apiRequest)
            options?.onSuccess?.(material, 'create')
            return material
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setError(new Error(errorMessage))
            options?.onError?.(error as Error, 'create')
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return { isSubmitting, error, createMaterial, transformFormDataToAPIRequest }
}