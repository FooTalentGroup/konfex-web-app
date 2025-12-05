'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GarmentFormData } from '@/types/IGarment';
import CustomInput from './CustomInput';
import CustomInputWithSelect from './CustomInputWithSelect';
import PriceDisplay from './PriceDisplay';
import CounterInputCustom from './CounterInputCustom';

interface ProductionTabFormProps {
    form: UseFormReturn<GarmentFormData>;
}

const ProductionTabForm: React.FC<ProductionTabFormProps> = ({ form }) => {
    const { register, watch, setValue, formState: { errors } } = form;

    const laborRate = watch('laborRate') || 0;
    const laborHours = watch('laborHours') || 0;
    const wastePrice = watch('wastePrice') || 0;

    const laborCost = laborRate * laborHours;

    return (
        <section className="space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Mano obra</h3>
                    <PriceDisplay label="" amount={laborCost} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className='flex flex-col gap-1'>
                        <CustomInput
                            id="laborRate"
                            label="Tarifa salarial ($/hora)"
                            type="number"
                            register={register('laborRate', { required: 'La tarifa salarial es requerida', valueAsNumber: true })}
                            error={errors.laborRate?.message}
                            placeholder="000.000"
                            className="bg-white"
                            unit="$"
                        />
                        <span className="text-xs text-primary-500">Costo por hora del trabajo</span>
                    </div>

                    <div className='flex flex-col gap-6'>
                        <CounterInputCustom
                            id="laborHours"
                            label="Cantidad"
                            value={laborHours}
                            setValue={(value) => setValue('laborHours', value)}
                            min={0}
                            max={999}
                            step={1}
                        />
                        <span className="text-xs text-primary-500">Horas estimadas</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Merma</h3>
                    <PriceDisplay label="" amount={wastePrice} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <CustomInputWithSelect
                        id="wasteMaterial"
                        label="Merma materia prima"
                        register={register('wasteMaterial', { valueAsNumber: true })}
                        error={errors.wasteMaterial?.message}
                        placeholder="3"
                        selectId="wasteUnit"
                        selectRegister={register('wasteUnit')}
                        selectOptions={[
                            { value: 'm', label: 'm' },
                            { value: 'cm', label: 'cm' },
                            { value: 'kg', label: 'kg' },
                        ]}
                        selectError={errors.wasteUnit?.message}
                        className="bg-white"
                    />

                    <CustomInput
                        id="wastePrice"
                        label="Precio"
                        type="number"
                        register={register('wastePrice', { valueAsNumber: true })}
                        error={errors.wastePrice?.message}
                        placeholder="2.500"
                        className="bg-white"
                        unit="$"
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductionTabForm;