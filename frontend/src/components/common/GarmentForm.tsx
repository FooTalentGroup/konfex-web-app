"use client"
import React from 'react'
import ImageUploadField from '../ui/ImageUploadField'
import GarmentDetailTabForm from '../ui/GarmentDetailTabForm';
import RawMaterialTabForm from '../ui/RawMaterialTabForm';
import ProductionTabForm from '../ui/ProductionTabForm';
import { useAddGarmentForm, useImageUpload } from '@/hooks';
import TabNavigation from '../ui/TabNavigation';
import PriceDisplay from '../ui/PriceDisplay';
import GarmentInfoCard from '../ui/GarmentInfoCard';

export default function GarmentForm() {

    const { activeTab, tabs, setActiveTab, form, setValue, errors, submit } = useAddGarmentForm();

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

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <GarmentDetailTabForm form={form} />;
            case 1:
                return <RawMaterialTabForm />;
            case 2:
                return <ProductionTabForm />;
            default:
                return null;
        }
    };

    const { id, season, price } = form.watch();

    return (
        <div className="space-y-6 p-4">
            {/* Campo de imagen */}
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
            </div>


            {/* Tarjeta de información */}
            <div className="space-y-6">
                <GarmentInfoCard
                    id={id || 'Cargando...'}
                    season={season || 'Cargando...'}
                    price={price || 0}
                />
            </div>



            <div className='border-2 border-primary-300 rounded-lg'>
                {/* Navegación de pestañas */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    className="px-6 pt-6"
                />

                {/* Contenido de las pestañas */}
                <div className="p-6">
                    {renderTabContent()}
                </div>
            </div>

            <div className="p-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={submit}
                    className="w-full bg-[#B65CF2] text-white py-2 px-4 rounded-md hover:bg-[#9a4bc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B65CF2] transition-colors"
                >
                    Guardar
                </button>
            </div>
        </div>
    )
}
