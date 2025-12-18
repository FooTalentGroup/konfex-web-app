'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GarmentFormData } from '@/types/IGarment';
import CustomInputWithSelect from './CustomInputWithSelect';
import MaterialSearchSelect from './MaterialSearchSelect';
import { AlertCircle, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterialsForService';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

const EmptyMaterialsAlert = ({ type, onNavigate }: { type: 'fabric' | 'supply'; onNavigate: () => void }) => (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-800 mb-1">
                No hay {type === 'fabric' ? 'telas' : 'insumos'} registrados
            </h4>
            <p className="text-sm text-amber-700 mb-2">
                Debes crear {type === 'fabric' ? 'telas' : 'insumos'} en el sistema antes de poder agregarlos a una prenda.
            </p>
            <button
                type="button"
                onClick={onNavigate}
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 underline"
            >
                Ir a crear materiales
                <ExternalLink className="w-4 h-4" />
            </button>
        </div>
    </div>
);

interface RawMaterialTabFormProps {
    form: UseFormReturn<GarmentFormData>;
}

const RawMaterialTabForm: React.FC<RawMaterialTabFormProps> = ({ form }) => {
    const { register, watch, setValue, formState: { errors } } = form;
    const { materials, isLoading, error } = useMaterials();
    const toast = useToast();
    const router = useRouter();

    const rawMaterials = watch('rawMaterials') || [];

    const fabricMaterials = rawMaterials.filter(m => m.type === 'fabric');
    const supplyMaterials = rawMaterials.filter(m => m.type === 'supply');

    const totalPriceMaterials = rawMaterials.reduce((sum, material) => sum + (material.price ?? 0), 0);


    const addFabric = () => {
        const materialIdStr = watch('tempFabricName');
        const consumption = watch('tempFabricConsumption');
        const unit = watch('tempFabricUnit');

        if (!materialIdStr || !consumption || !unit) {
            toast.showWarning('Por favor completa todos los campos de tela');
            return;
        }

        if (consumption <= 0) {
            toast.showWarning('El consumo debe ser mayor a 0');
            return;
        }


        const selectedMaterial = materials.find(m => m.id === parseInt(materialIdStr, 10));

        if (!selectedMaterial) {
            toast.showWarning('Material no encontrado');
            return;
        }

        if (rawMaterials.some(m => m.id === materialIdStr)) { toast.showWarning('Este material ya ha sido agregado'); return; }

        const newMaterial = {
            id: materialIdStr,
            type: 'fabric' as const,
            name: selectedMaterial.nombre,
            consumption,
            unit: selectedMaterial.unidadMedida,
            price: selectedMaterial.precio * consumption,
        };

        setValue('rawMaterials', [...rawMaterials, newMaterial]);

        setValue('tempFabricName', '');
        setValue('tempFabricConsumption', 0);
        setValue('tempFabricUnit', 'm');
        setValue('tempFabricPrice', 0);
    };

    const addSupply = () => {
        const materialIdStr = watch('tempSupplyName');
        const consumption = watch('tempSupplyConsumption');
        const unit = watch('tempSupplyUnit');

        if (!materialIdStr || !consumption || !unit) {
            toast.showWarning('Por favor completa todos los campos de insumo');
            return;
        }

        if (consumption <= 0) {
            toast.showWarning('El consumo debe ser mayor a 0');
            return;
        }


        const selectedMaterial = materials.find(m => m.id === parseInt(materialIdStr, 10));

        if (!selectedMaterial) {
            toast.showWarning('Material no encontrado');
            return;
        }

        const newMaterial = {
            id: materialIdStr,
            type: 'supply' as const,
            name: selectedMaterial.nombre,
            consumption,
            unit: selectedMaterial.unidadMedida,
            price: selectedMaterial.precio * consumption,
        };

        setValue('rawMaterials', [...rawMaterials, newMaterial]);

        setValue('tempSupplyName', '');
        setValue('tempSupplyConsumption', 0);
        setValue('tempSupplyUnit', 'm');
        setValue('tempSupplyPrice', 0);
    };

    const removeMaterial = (id: string) => {
        setValue('rawMaterials', rawMaterials.filter(m => m.id !== id));
    };

    return (
        <section className="space-y-6">

            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Materia prima</h3>
                <span className="flex items-center gap-1 text-base text-[#B65CF2] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-800 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {totalPriceMaterials}
                </span>
            </div>

            <div className="flex-1 border-t border-gray-400"></div>

            <div className="space-y-4">

                <MaterialSearchSelect
                    id="tempFabricName"
                    label="Tela"
                    materials={materials}
                    isLoading={isLoading}
                    error={error || undefined}
                    value={watch('tempFabricName')}
                    onChange={(materialId, material) => {
                        setValue('tempFabricName', materialId);
                        setValue('tempFabricUnit', material.unidadMedida || 'm');
                    }}
                    placeholder="Ej. Algodón"
                    type="fabric"
                />

                {!isLoading && !error && materials.filter(m => m.categoria?.nombre?.toLowerCase() === 'tela').length === 0 && (
                    <EmptyMaterialsAlert type="fabric" onNavigate={() => router.push('/raw-materials')} />
                )}

                <CustomInputWithSelect
                    id="tempFabricConsumption"
                    label="Consumo"
                    register={register('tempFabricConsumption', { valueAsNumber: true })}
                    error={errors.tempFabricConsumption?.message}
                    placeholder="2.00"
                    selectId="tempFabricUnit"
                    selectRegister={register('tempFabricUnit')}
                    selectOptions={[
                        { value: 'm', label: 'm' },
                        { value: 'cm', label: 'cm' },
                    ]}
                    selectError={errors.tempFabricUnit?.message}
                    className="bg-white"
                    style={{ borderColor: '#6A5379' }}
                />

                <div className="grid grid-cols-2 gap-4">

                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-400"></div>
                    <div className='grid grid-cols-1 gap-1 items-center justify-items-center'>
                        <button
                            type="button"
                            onClick={addFabric}
                            className="flex items-center justify-center w-10 h-10 bg-[#F59E0B] border border-primary-300 rounded-full hover:bg-[#D97706] transition-colors"
                        >
                            <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="text-sm text-gray-600">Agregar tela</span>
                    </div>
                    <div className="flex-1 border-t border-gray-400"></div>
                </div>

                {fabricMaterials.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h5 className="text-sm font-semibold text-gray-700">Lista de telas agregadas:</h5>
                        {fabricMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="flex items-center justify-between bg-primary-75 p-4 rounded-lg border border-primary-500"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{material.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {material.consumption} {material.unit}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        $ {material.price ?? 0}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeMaterial((material.id) as string)}
                                        className="bg-primary-200 p-1 text-gray-500 hover:text-gray-700 border border-primary-500 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <div className="space-y-4">

                <MaterialSearchSelect
                    id="tempSupplyName"
                    label="Insumos"
                    materials={materials}
                    isLoading={isLoading}
                    error={error || undefined}
                    value={watch('tempSupplyName')}
                    onChange={(materialId, material) => {
                        setValue('tempSupplyName', materialId);
                        setValue('tempSupplyUnit', material.unidadMedida || 'm');
                    }}
                    placeholder="Ej. Botones L24 + cortesía"
                    type="supply"
                />

                {!isLoading && !error && materials.filter(m => m.categoria?.nombre?.toLowerCase() !== 'tela').length === 0 && (
                    <EmptyMaterialsAlert type="supply" onNavigate={() => router.push('/raw-materials')} />
                )}

                <CustomInputWithSelect
                    id="tempSupplyConsumption"
                    label="Consumo"
                    register={register('tempSupplyConsumption', { valueAsNumber: true })}
                    error={errors.tempSupplyConsumption?.message}
                    placeholder="4"
                    selectId="tempSupplyUnit"
                    selectRegister={register('tempSupplyUnit')}
                    selectOptions={[
                        { value: 'm', label: 'm' },
                        { value: 'cm', label: 'cm' },
                        { value: 'un', label: 'un' },
                    ]}
                    selectError={errors.tempSupplyUnit?.message}
                    className="bg-white"
                    style={{ borderColor: '#6A5379' }}
                />

                <div className="grid grid-cols-2 gap-4">
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-400"></div>
                    <div className='grid grid-cols-1 gap-1 justify-items-center'>
                        <button
                            type="button"
                            onClick={addSupply}
                            className="flex items-center justify-center w-10 h-10 bg-[#F59E0B] border border-primary-300 rounded-full hover:bg-[#D97706] transition-colors"
                        >
                            <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="text-sm text-gray-600">Agregar insumo</span>
                    </div>
                    <div className="flex-1 border-t border-gray-400"></div>
                </div>

                {supplyMaterials.length > 0 && (
                    <div className="space-y-3 mt-4">
                        <h5 className="text-sm font-semibold text-gray-700">Lista de insumos agregados:</h5>
                        {supplyMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="flex items-center justify-between bg-primary-75 p-4 rounded-lg border border-primary-500"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{material.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {material.consumption} {material.unit}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        $ {material.price ?? 0}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeMaterial((material.id) as string)}
                                        className="bg-primary-200 p-1 text-gray-500 hover:text-gray-700 border border-primary-500 rounded-md transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
};

export default RawMaterialTabForm;
