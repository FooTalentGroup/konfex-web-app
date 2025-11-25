"use client"
import { FabricFormData, fabricSchema } from '@/types/IFabric'
import CustomInput from '../ui/CustomInput'
import ImageUploadField from '../ui/ImageUploadField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useImageUpload } from '@/hooks/useImageUpload'

export default function FabricForm() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FabricFormData>({
        resolver: zodResolver(fabricSchema),
        mode: 'onBlur',
    })

    const {
        imagePreview,
        isUploading,
        uploadError,
        fileInputRef,
        handleImageClick,
        handleImageChange,
        handleRemoveImage,
    } = useImageUpload({
        onUploadSuccess: (url) => {
            setValue('image', url, { shouldValidate: true })
        },
        onUploadError: (error) => {
            console.error('Error en upload:', error)
        }
    })

    const onRemoveImage = () => {
        handleRemoveImage(() => {
            setValue('image', '', { shouldValidate: true })
        })
    }

    const onSubmit = async (data: FabricFormData) => {
        try {
            console.log('Datos del formulario:', data)

            await new Promise(resolve => setTimeout(resolve, 1000))

            alert('Tela guardada exitosamente!')
        } catch (error) {
            console.error('Error al guardar:', error)
            alert('Error al guardar la tela')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-black">Agregar tela</h2>

            <ImageUploadField
                imagePreview={imagePreview}
                isUploading={isUploading}
                uploadError={uploadError}
                validationError={errors.image?.message}
                fileInputRef={fileInputRef}
                onImageClick={handleImageClick}
                onImageChange={handleImageChange}
                onRemoveImage={onRemoveImage}
            />

            <CustomInput
                id="category"
                label="Categoría"
                type='text'
                register={register('category')}
                error={errors.category?.message}
                placeholder="Ej. Tela"
            />

            <div className="space-y-4">
                <h3 className="text-base font-semibold text-black">Detalle</h3>

                <CustomInput
                    id="material"
                    label="Material"
                    type='text'
                    register={register('material')}
                    error={errors.material?.message}
                    placeholder="Ej. Algodón"
                    className="bg-white"
                />

                <CustomInput
                    id="size"
                    label="Tamaño (Metros)"
                    type='text'
                    register={register('size', { valueAsNumber: true })}
                    error={errors.size?.message}
                    placeholder="Ej. 1.70"
                    className="bg-white"
                />

                <CustomInput
                    id="weight"
                    label="Peso (Kg)"
                    register={register('weight', { valueAsNumber: true })}
                    error={errors.weight?.message}
                    placeholder="Ej. 14"
                    className="bg-white"
                />

                <CustomInput
                    id="colors"
                    label="Colores"
                    register={register('colors')}
                    error={errors.colors?.message}
                    placeholder="Ej. Rojo, Azul, Negro..."
                    className="bg-white"
                />

                <CustomInput
                    id="supplier"
                    label="Proveedor"
                    register={register('supplier')}
                    error={errors.supplier?.message}
                    placeholder="Ej: TexSports"
                    className="bg-white"
                />

                <CustomInput
                    id="totalPrice"
                    label="Precio total"
                    type="number"
                    register={register('totalPrice', { valueAsNumber: true })}
                    error={errors.totalPrice?.message}
                    placeholder="30"
                    unit="$"
                    className="bg-white"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full bg-primary-500 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
        </form>
    )
}
