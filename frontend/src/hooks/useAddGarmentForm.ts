import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GarmentSchema, GarmentFormData } from '@/types/IGarment';


export interface AddGarmentFormState {
    activeTab: number;
    form: UseFormReturn<GarmentFormData>;
}

const tabs = ['Detalle prenda', 'Materia prima', 'Producción'] as const;

const generateId = () => {
    const prefix = '000';
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const suffix = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    return `${prefix}-${random}-${suffix}`;
};

export const useAddGarmentForm = () => {
    const [state, setState] = useState<AddGarmentFormState>({
        activeTab: 0,
        form: useForm<GarmentFormData>({
            resolver: zodResolver(GarmentSchema),
            defaultValues: {
                id: generateId(),
                season: 'Verano 2025',
                price: 0,
            }
        }),
    });

    const setActiveTab = (index: number) => {
        setState(prev => ({ ...prev, activeTab: index }));
    };

    const nextTab = () => {
        setState(prev => ({
            ...prev,
            activeTab: prev.activeTab < tabs.length - 1 ? prev.activeTab + 1 : prev.activeTab,
        }));
    };

    const prevTab = () => {
        setState(prev => ({
            ...prev,
            activeTab: prev.activeTab > 0 ? prev.activeTab - 1 : prev.activeTab,
        }));
    };

    return {
        ...state,
        tabs: [...tabs],
        setActiveTab,
        nextTab,
        prevTab,
        setValue: state.form.setValue,
        register: state.form.register,
        errors: state.form.formState.errors,
        submit: state.form.handleSubmit((data) => {
            console.log('Formulario enviado:', data);
        }),
    
    };
};