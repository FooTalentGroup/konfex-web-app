import { useEffect, useState } from 'react';
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
    const form = useForm<GarmentFormData>({
        resolver: zodResolver(GarmentSchema),
        defaultValues: {
            id: generateId(),
            season: 'Verano 2025',
            price: 0,
            rawMaterials: [],
            tempFabricUnit: 'm',
            tempSupplyUnit: 'm',
            laborRate: 0,
            laborHours: 0,
            wasteMaterial: 0,
            wasteUnit: 'm',
            wastePrice: 0,
        },
        mode: 'onChange',
    });

    const [activeTab, setActiveTab] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const subscription = form.watch((value) => {
            const rawMaterialsTotal = (value.rawMaterials || []).reduce(
                (sum, material) => sum + (material?.price || 0),
                0
            );

            const laborCost = (value.laborRate || 0) * (value.laborHours || 0);

            const wasteCost = value.wastePrice || 0;

            const totalPrice = rawMaterialsTotal + laborCost + wasteCost;

            if (value.price !== totalPrice) {
                form.setValue('price', totalPrice, { shouldValidate: false });
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const nextTab = () => {
        setActiveTab((prev) => (prev < tabs.length - 1 ? prev + 1 : prev));
    };

    const prevTab = () => {
        setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleSubmit = async (data: GarmentFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const cleanData = {
                ...data,
                tempFabricName: undefined,
                tempFabricConsumption: undefined,
                tempFabricUnit: undefined,
                tempFabricPrice: undefined,
                tempSupplyName: undefined,
                tempSupplyConsumption: undefined,
                tempSupplyUnit: undefined,
                tempSupplyPrice: undefined,
            };

            console.log('✅ Prenda guardada exitosamente:', cleanData);

            setActiveTab(0);
            form.reset();
            alert('Prenda guardada exitosamente');

        } catch (error) {
            setSubmitError(
                error instanceof Error 
                    ? error.message 
                    : 'Ocurrió un error al guardar la prenda'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        activeTab,
        tabs: [...tabs],
        setActiveTab,
        nextTab,
        prevTab,
        setValue: form.setValue,
        register: form.register,
        errors: form.formState.errors,
        // submit: form.handleSubmit((data) => {
        //     console.log('Formulario enviado:', data);
        // }),
        isSubmitting,
        submitError,
        submit: form.handleSubmit(handleSubmit),
    
    };
};