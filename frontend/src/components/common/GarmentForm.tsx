"use client"
import ImageUploadField from '../ui/ImageUploadField'
import GarmentDetailTabForm from '../ui/GarmentDetailTabForm';
import RawMaterialTabForm from '../ui/RawMaterialTabForm';
import ProductionTabForm from '../ui/ProductionTabForm';
import { useAddGarmentForm, useImageUpload } from '@/hooks';
import TabNavigation from '../ui/TabNavigation';
import GarmentInfoCard from '../ui/GarmentInfoCard';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface GarmentFormProps {
    collectionId?: number; 
}

export default function GarmentForm({ collectionId }: GarmentFormProps) {

    const toast = useToast();

    const { activeTab, tabs, isFormComplete, setActiveTab, form, setValue, errors, submit, isSubmitting, submitError } = useAddGarmentForm(collectionId);

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
            toast.showError(`Error al subir la imagen: ${error}`);
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
                return <RawMaterialTabForm form={form} />;
            case 2:
                return <ProductionTabForm form={form} />;
            default:
                return null;
        }
    };

    const formValues = form.watch();

    const { id, season, price } = formValues;

    const onSave = async () => {
        const isValid = await form.trigger(); 
        if (isValid) {
            submit();
            onRemoveImage();
        } else {
            const hasDetailErrors = errors.image || errors.commercialName || errors.sizes || errors.colors;
            const hasMaterialErrors = errors.rawMaterials;
            
            if (hasDetailErrors) {
                setActiveTab(0); 
                toast.showWarning('Por favor completa todos los campos obligatorios en "Detalle prenda"');
            } else if (hasMaterialErrors) {
                setActiveTab(1); 
                toast.showWarning('Debes agregar al menos un material (tela o insumo)');
            }
        }
    }

    return (
        <div className="space-y-6 p-4">
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


            <div className="space-y-6">
                <GarmentInfoCard
                    id={id || 0}
                    season={season || 'Cargando...'}
                    price={price || 0}
                />
            </div>



            <div className='border border-primary-300 rounded-lg mb-0.5'>
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    className="px-6 pt-6"
                />

                <div className="p-6">
                    {renderTabContent()}
                </div>
            </div>

            <div className="p-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSubmitting || isUploading || !isFormComplete}
                    className={`w-full  py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B65CF2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting || !isFormComplete ? 'bg-[#F4E7FD] text-[#9133cf] border border-[#B65CF2] cursor-not-allowed' : 'bg-[#B65CF2] text-white hover:bg-[#9a4bc4]'}`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Guardando...</span>
                        </div>
                    ) : (
                        <span>Guardar</span>
                    )}
                </button>
            </div>

            {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">
                            Error al guardar
                        </h4>
                        <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
