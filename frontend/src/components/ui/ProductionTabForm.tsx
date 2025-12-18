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
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Mano obra</h3>
                    <span className="flex items-center gap-1 text-base text-[#B65CF2] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-800 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {laborCost}
                </span>
                </div>

                <div className="flex-1 border-t border-gray-400"></div>

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
                            style={{ borderColor: '#6A5379' }}
                            unit="$"
                        />
                        <span className="text-xs text-primary-500">Costo por hora del trabajo</span>
                    </div>

                    <div className='flex flex-col gap-1.5'>
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
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Merma</h3>
                    <span className="flex items-center gap-1 text-base text-[#B65CF2] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-800 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {wastePrice}
                </span>
                </div>

                <div className="flex-1 border-t border-gray-400"></div>

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
                        style={{ borderColor: '#6A5379' }}
                    />

                    <CustomInput
                        id="wastePrice"
                        label="Precio"
                        type="number"
                        register={register('wastePrice', { valueAsNumber: true })}
                        error={errors.wastePrice?.message}
                        placeholder="2.500"
                        className="bg-white"
                        style={{ borderColor: '#6A5379' }}
                        unit="$"
                    />
                </div>
            </div>
        </section>
    );
};

export default ProductionTabForm;
