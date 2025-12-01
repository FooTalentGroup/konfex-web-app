'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GarmentFormData } from '@/types/IGarment';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import CustomInputWithSelect from './CustomInputWithSelect';
import PriceDisplay from './PriceDisplay';
import { Plus, Trash2 } from 'lucide-react';

interface RawMaterialTabFormProps {
    form: UseFormReturn<GarmentFormData>;
}

const RawMaterialTabForm: React.FC<RawMaterialTabFormProps> = ({ form }) => {
    const { register, watch, setValue, formState: { errors } } = form;

    const rawMaterials = watch('rawMaterials') || [];

    const totalPrice = rawMaterials.reduce((sum, material) => sum + material.price, 0);

    const fabrics = [
        { value: 'algodon', label: 'Algodón' },
        { value: 'poliester', label: 'Poliéster' },
        { value: 'seda', label: 'Seda' },
    ];

    const supplies = [
        { value: 'botones', label: 'Botones' },
        { value: 'cremalleras', label: 'Cremalleras' },
        { value: 'hilos', label: 'Hilos' },
    ];

    const addFabric = () => {
        const name = watch('tempFabricName');
        const consumption = watch('tempFabricConsumption');
        const unit = watch('tempFabricUnit');
        const price = watch('tempFabricPrice');

        if (!name || !consumption || !unit || !price) {
            alert('Por favor completa todos los campos de tela');
            return;
        }

        if (consumption <= 0) {
            alert('El consumo debe ser mayor a 0');
            return;
        }

        if (price < 0) {
            alert('El precio debe ser mayor o igual a 0');
            return;
        }

        const newMaterial = {
            id: `fabric-${Date.now()}`,
            type: 'fabric' as const,
            name,
            consumption,
            unit,
            price,
        };

        setValue('rawMaterials', [...rawMaterials, newMaterial]);

        setValue('tempFabricName', '');
        setValue('tempFabricConsumption', 0);
        setValue('tempFabricUnit', 'm');
        setValue('tempFabricPrice', 0);
    };

    const addSupply = () => {
        const name = watch('tempSupplyName');
        const consumption = watch('tempSupplyConsumption');
        const unit = watch('tempSupplyUnit');
        const price = watch('tempSupplyPrice');

        if (!name || !consumption || !unit || !price) {
            alert('Por favor completa todos los campos de insumo');
            return;
        }

         if (consumption <= 0) {
            alert('El consumo debe ser mayor a 0');
            return;
        }

        if (price < 0) {
            alert('El precio debe ser mayor o igual a 0');
            return;
        }

        const newMaterial = {
            id: `supply-${Date.now()}`,
            type: 'supply' as const,
            name,
            consumption,
            unit,
            price,
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

            {rawMaterials.length > 0 && (
                <div className="space-y-3">
                    {rawMaterials.map((material) => (
                        <div
                            key={material.id}
                            className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{material.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    {material.consumption} {material.unit}
                                </span>
                                <span className="text-sm font-semibold text-gray-800">
                                    $ {material.price.toLocaleString('es-CO')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeMaterial(material.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Tela</h4>
                
                <CustomSelect
                    id="tempFabricName"
                    label="Tela"
                    options={fabrics}
                    register={register('tempFabricName')}
                    error={errors.tempFabricName?.message}
                    placeholder="Ej. Algodón"
                    className="bg-white"
                />

                <div className="grid grid-cols-2 gap-4">
                    <CustomInputWithSelect
                        id="tempFabricConsumption"
                        label="Consumo"
                        register={register('tempFabricConsumption', {  valueAsNumber: true })}
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

                    <CustomInput
                        id="tempFabricPrice"
                        label="Precio"
                        type="number"
                        register={register('tempFabricPrice', { valueAsNumber: true })}
                        error={errors.tempFabricPrice?.message}
                        placeholder="25.000"
                        className="bg-white"
                        unit="$"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <button
                        type="button"
                        onClick={addFabric}
                        className="flex items-center justify-center w-10 h-10 bg-white border-2 border-primary-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Insumos</h4>
                
                <CustomSelect
                    id="tempSupplyName"
                    label="Insumos"
                    options={supplies}
                    register={register('tempSupplyName')}
                    error={errors.tempSupplyName?.message}
                    placeholder="Ej. Botones L24 + cortesía"
                    className="bg-white"
                />

                <div className="grid grid-cols-2 gap-4">
                    <CustomInputWithSelect
                        id="tempSupplyConsumption"
                        label="Consumo"
                        register={register('tempSupplyConsumption', { valueAsNumber: true })}
                        error={errors.tempSupplyConsumption?.message}
                        placeholder="6"
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

                    <CustomInput
                        id="tempSupplyPrice"
                        label="Precio"
                        type="number"
                        register={register('tempSupplyPrice', { valueAsNumber: true })}
                        error={errors.tempSupplyPrice?.message}
                        placeholder="35.000"
                        className="bg-white"
                        unit="$"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <button
                        type="button"
                        onClick={addSupply}
                        className="flex items-center justify-center w-10 h-10 bg-white border-2 border-primary-300 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>
        </section>
    );
};

export default RawMaterialTabForm;