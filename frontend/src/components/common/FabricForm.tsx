"use client"
import { FabricFormData, fabricSchema } from '@/types/IFabric'
import CustomInput from '../ui/CustomInput'
import ImageUploadField from '../ui/ImageUploadField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useImageUpload } from '@/hooks/useImageUpload'
import CustomInputWithSelect from '../ui/CustomInputWithSelect'

export default function FabricForm() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(fabricSchema),
        mode: 'onBlur',
        defaultValues: {
            rollWidthUnit: 'm',
            weightUnit: 'gr/m2'
        }
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

    const rollWidthOptions = [
        { value: 'm', label: 'm' },
        { value: 'cm', label: 'cm' },
        { value: 'yds', label: 'yds' }
    ]

    const weightOptions = [
        { value: 'gr/m2', label: 'gr/m²' },
        { value: 'kg/m2', label: 'kg/m²' },
        { value: 'oz/yd2', label: 'oz/yd²' }
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="p-6 space-y-6">
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

                <div className="space-y-4">
                    <h3 className="text-base text-black mb-1">Categoría: <span className='font-bold'>Tela</span></h3>

                    <div className='border border-primary-300'></div>

                    <CustomInput
                        id="material"
                        label="Material"
                        type='text'
                        register={register('material')}
                        error={errors.material?.message}
                        placeholder="Algodón"
                        className="bg-white"
                    />

                    <div className='flex gap-4'>
                        <CustomInputWithSelect
                            id="rollWidth"
                            label="Ancho rollo"
                            type="number"
                            register={register('rollWidth', { 
                                required: 'El ancho del rollo es requerido',
                                valueAsNumber: true 
                            })}
                            error={errors.rollWidth?.message}
                            placeholder="1.70"
                            className="bg-white"
                            selectId="rollWidthUnit"
                            selectRegister={register('rollWidthUnit')}
                            selectOptions={rollWidthOptions}
                            selectError={errors.rollWidthUnit?.message}
                        />

                        <CustomInputWithSelect
                            id="weight"
                            label="Peso"
                            type="number"
                            register={register('weight', { 
                                required: 'El peso es requerido',
                                valueAsNumber: true 
                            })}
                            error={errors.weight?.message}
                            placeholder="500"
                            className="bg-white"
                            selectId="weightUnit"
                            selectRegister={register('weightUnit')}
                            selectOptions={weightOptions}
                            selectError={errors.weightUnit?.message}
                        />
                    </div>


                    <CustomInput
                        id="colors"
                        label="Colores"
                        register={register('colors')}
                        error={errors.colors?.message}
                        placeholder="Rojo, Azul, Negro..."
                        className="bg-white"
                    />

                    <CustomInput
                        id="supplier"
                        label="Proveedor"
                        register={register('supplier')}
                        error={errors.supplier?.message}
                        placeholder="Juan Lopez"
                        className="bg-white"
                    />

                    <CustomInput
                        id="totalPrice"
                        label="Precio (m, ud)"
                        type="number"
                        register={register('totalPrice', { 
                            required: 'El precio es requerido',
                            valueAsNumber: true 
                        })}
                        error={errors.totalPrice?.message}
                        placeholder="70000"
                        unit="$"
                        className="bg-white"
                    />
                </div>

                <div className='border border-primary-300'></div>

            </div>

            <div className='sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#E6E1EA] via-[#E6E1EA] to-transparent'>
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full bg-secondary-500 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}
