import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GarmentSchema, GarmentFormData, CreateGarmentPayload } from '@/types/IGarment';
import { garmentService } from '@/services/garment.service';


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
            wasteUnit: 'm',
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

            const payload = {
                ...data,
                nombre: data.commercialName,
                descripcion: data.description,
                activo: true,
                tallas: data.sizes.split(',').map((size) => size.trim()),
                colores: data.colors.split(',').map((color) => color.trim()),

                rawMaterial: data.rawMaterials,

                laborRate: data.laborRate,
                laborHours: data.laborHours,
                wasteMaterial: data.wasteMaterial,
                wasteUnit: data.wasteUnit,
                wastePrice: data.wastePrice,

                tempFabricName: undefined,
                tempFabricConsumption: undefined,
                tempFabricUnit: undefined,
                tempFabricPrice: undefined,
                tempSupplyName: undefined,
                tempSupplyConsumption: undefined,
                tempSupplyUnit: undefined,
                tempSupplyPrice: undefined,

            } as CreateGarmentPayload;

            console.log('📤 Enviando datos al backend:', payload);

            await garmentService.create(payload);

            console.log('✅ Request completado (backend puede tener error, pero eso es esperado)', payload);

            alert('✅ Request completado (backend puede tener error, pero eso está en espera)');
            setActiveTab(0);
            form.reset();

        } catch (error) {
            console.warn('⚠️ Error en la petición (esperado):', error);
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
