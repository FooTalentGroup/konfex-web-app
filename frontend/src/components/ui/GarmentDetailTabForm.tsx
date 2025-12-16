import React from 'react';
import CustomInput from './CustomInput';
import CustomSelect from './CustomSelect';
import { GarmentFormData } from '@/types/IGarment';
import { UseFormReturn } from 'react-hook-form';

interface GarmentDetailTabProps {
    form: UseFormReturn<GarmentFormData>;
}

const GarmentDetailTabForm: React.FC<GarmentDetailTabProps> = ({ form }) => {
    const { register, formState: { errors }, watch } = form;

    const sizes = [
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
    ];

    const colors = [
        { value: 'rojo', label: 'Rojo' },
        { value: 'verde', label: 'Verde' },
        { value: 'azul', label: 'Azul' },
        { value: 'negro', label: 'Negro' },
        { value: 'blanco', label: 'Blanco' },
    ];

    return (
        <section className='space-y-6'>
            <div className='space-y-4'>
                <CustomInput
                    id="commercialName"
                    label="Nombre comercial"
                    type='text'
                    register={register('commercialName', { required: 'El nombre comercial es requerido' })}
                    error={errors.commercialName?.message}
                    placeholder='Ej: Camiseta "Lirios"'
                    className='bg-white'
                    style={{ borderColor: '#6A5379' }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción breve</label>
                <textarea
                    {...register('description')}
                    placeholder="Ej: Camiseta de algodón para mujeres"
                    className="w-full px-3 py-2 border text-black bg-white border-[#6A5379] rounded-md shadow-sm focus:border-purple-300 focus:ring-1 focus-visible:ring-purple-300 outline-none focus:outline-none resize-none"
                    rows={3}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className='space-y-4'>
                <CustomSelect
                    id='sizes'
                    label='Tallas disponibles'
                    options={sizes}
                    register={register('sizes', { required: 'Las tallas son requeridas' })}
                    error={errors.sizes?.message}
                    placeholder='S, M, L'
                    className='bg-white'
                    style={{ borderColor: '#6A5379' }}
                />
            </div>

            <div className='space-y-4'>
                <CustomSelect
                    id='colors'
                    label='Colores'
                    options={colors}
                    register={register('colors', { required: 'Los colores son requeridos' })}
                    error={errors.colors?.message}
                    placeholder='Ej: Rojo, Azul, Negro'
                    className='bg-white'
                    style={{ borderColor: '#6A5379' }}
                />
            </div>

        </section>
    );
};

export default GarmentDetailTabForm;
