export interface CloudinaryUploadResponse {
    secure_url: string
    public_id: string
    width: number
    height: number
    format: string
}

export async function uploadImageToCloudinary(
    file: File,
    folder = "fabrics/"
): Promise<CloudinaryUploadResponse> {
    const cloudName = "dkedlvr1y"
    const uploadPreset = "konfex-fabrics"

    if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing')
    }

    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)
        formData.append('folder', folder)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Error al subir la imagen')
        }

        const data = await response.json()

        return {
            secure_url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
        }
    } catch (error) {
        console.error('Cloudinary Upload Error:', error)
        throw error
    }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'El archivo debe ser una imagen (JPG, PNG o WEBP)',
        }
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'La imagen no debe superar los 5MB',
        }
    }

    return { valid: true }
}