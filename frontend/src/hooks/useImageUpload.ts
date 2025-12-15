import { useState, useRef } from 'react'
import { uploadImageToCloudinary, validateImageFile } from '@/services/cloudinaryImg.service'

interface UseImageUploadProps {
    onUploadSuccess?: (url: string) => void
    onUploadError?: (error: string) => void
}

export function useImageUpload({ onUploadSuccess, onUploadError }: UseImageUploadProps = {}) {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validation = validateImageFile(file)
        if (!validation.valid) {
            const errorMsg = validation.error || 'Error en el archivo'
            setUploadError(errorMsg)
            onUploadError?.(errorMsg)
            return
        }

        setUploadError(null)
        setIsUploading(true)

        try {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            const result = await uploadImageToCloudinary(file)

            onUploadSuccess?.(result.secure_url)
        } catch (error) {
            const errorMsg = 'Error al subir la imagen. Intenta de nuevo.'
            setUploadError(errorMsg)
            setImagePreview(null)
            onUploadError?.(errorMsg)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = (onRemove?: () => void) => {
        setImagePreview(null)
        setUploadError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onRemove?.()
    }

    const resetUpload = () => {
        setImagePreview(null)
        setUploadError(null)
        setIsUploading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return {
        imagePreview,
        isUploading,
        uploadError,
        fileInputRef,

        handleImageClick,
        handleImageChange,
        handleRemoveImage,
        resetUpload,
    }
}