'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GarmentFormData } from '@/types/IGarment';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import CustomInputWithSelect from './CustomInputWithSelect';
import PriceDisplay from './PriceDisplay';
import { Plus, Trash2 } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterialsForService';
import { useToast } from '@/contexts/ToastContext';

interface RawMaterialTabFormProps {
    form: UseFormReturn<GarmentFormData>;
}

const RawMaterialTabForm: React.FC<RawMaterialTabFormProps> = ({ form }) => {
    const { register, watch, setValue, formState: { errors } } = form;
    const { materials, isLoading: loadingMaterials } = useMaterials();
    const toast = useToast();
    
    const rawMaterials = watch('rawMaterials') || [];
    
    const fabricMaterialsFromDB = materials.filter(m => m.categoria?.nombre.toUpperCase() === 'TELA');
    const supplyMaterialsFromDB = materials.filter(m => m.categoria?.nombre.toUpperCase() !== 'TELA');
    
    const fabricMaterials = rawMaterials.filter(m => m.type === 'fabric');
    const supplyMaterials = rawMaterials.filter(m => m.type === 'supply');
    
    const totalPrice = rawMaterials.reduce((sum, material) => sum + (material.price ?? 0), 0);
    
    
    const fabricOptions = fabricMaterialsFromDB.map(m => ({
        value: m.id.toString(),
        label: m.nombre
    }));

    const supplyOptions = supplyMaterialsFromDB.map(m => ({
        value: m.id.toString(),
        label: m.nombre
    }));

    const addFabric = () => {
        const materialIdStr = watch('tempFabricName');
        const consumption = watch('tempFabricConsumption');
        const unit = watch('tempFabricUnit');
        const price = watch('tempFabricPrice');

        if (!materialIdStr || !consumption || !unit) {
            toast.showWarning('Por favor completa todos los campos de tela');
            return;
        }

        if (consumption <= 0) {
            toast.showWarning('El consumo debe ser mayor a 0');
            return;
        }


        const selectedMaterial = materials.find(m => m.id === parseInt(materialIdStr));

        if (!selectedMaterial) {
            toast.showWarning('Material no encontrado');
            return;
        }

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
        // const price = watch('tempSupplyPrice');

        if (!materialIdStr || !consumption || !unit) {
            toast.showWarning('Por favor completa todos los campos de insumo');
            return;
        }

        if (consumption <= 0) {
            toast.showWarning('El consumo debe ser mayor a 0');
            return;
        }


        const selectedMaterial = materials.find(m => m.id === parseInt(materialIdStr));

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

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Materia prima</h3>
                <PriceDisplay label="" amount={totalPrice} />
            </div>

            <div className="space-y-4">

                <CustomSelect
                    id="tempFabricName"
                    label="Tela"
                    options={fabricOptions}
                    register={register('tempFabricName')}
                    error={errors.tempFabricName?.message}
                    placeholder="Ej. Algodón"
                    className="bg-white"
                />

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
                />

                <div className="grid grid-cols-2 gap-4">

                    {/* <CustomInput
                        id="tempFabricPrice"
                        label="Precio"
                        type="number"
                        register={register('tempFabricPrice', { valueAsNumber: true })}
                        error={errors.tempFabricPrice?.message}
                        placeholder="25.000"
                        className="bg-white"
                        unit="$"
                    /> */}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className='grid grid-cols-1 gap-1 items-center justify-items-center'>
                        <button
                            type="button"
                            onClick={addFabric}
                            className="flex items-center justify-center w-10 h-10 bg-[#F59E0B] border-2 border-primary-300 rounded-full hover:bg-[#D97706] transition-colors"
                        >
                            <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="text-sm text-gray-600">Agregar tela</span>
                    </div>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
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
                                    $ {material.price}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeMaterial(material.id)}
                                    className="bg-primary-200 p-1 text-gray-500 hover:text-gray-700 border border-primary-500 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                <CustomSelect
                    id="tempSupplyName"
                    label="Insumos"
                    options={supplyOptions}
                    register={register('tempSupplyName')}
                    error={errors.tempSupplyName?.message}
                    placeholder="Ej. Botones L24 + cortesía"
                    className="bg-white"
                />

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
                />
                <div className="grid grid-cols-2 gap-4">

                    {/* <CustomInput
                        id="tempSupplyPrice"
                        label="Precio"
                        type="number"
                        register={register('tempSupplyPrice', { valueAsNumber: true })}
                        error={errors.tempSupplyPrice?.message}
                        placeholder="35.000"
                        className="bg-white"
                        unit="$"
                    /> */}
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <div className='grid grid-cols-1 gap-1 justify-items-center'>
                        <button
                            type="button"
                            onClick={addSupply}
                            className="flex items-center justify-center w-10 h-10 bg-[#F59E0B] border-2 border-primary-300 rounded-full hover:bg-[#D97706] transition-colors"
                        >
                            <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                        <span className="text-sm text-gray-600">Agregar insumo</span>
                    </div>
                    <div className="flex-1 border-t border-gray-300"></div>
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
                                        $ {material.price}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeMaterial(material.id)}
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