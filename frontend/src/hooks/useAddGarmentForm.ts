"use client";
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GarmentSchema, GarmentFormData, CreateGarmentPayload } from '@/types/IGarment';
import { garmentService } from '@/services/garment.service';
import { collectionService } from '@/services/collection.service';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';


export interface AddGarmentFormState {
    activeTab: number;
    form: UseFormReturn<GarmentFormData>;
}

const tabs = ['Detalle prenda', 'Materia prima', 'Producción'] as const;

const generateId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const useAddGarmentForm = (collectionId?: number) => {
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

    const toast = useToast();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (collectionId) {
            collectionService.getById(collectionId.toString())
                .then((collection) => {
                    form.setValue('season', collection.nombre, { shouldValidate: true });
                })
                .catch((error) => {
                    console.error('Error fetching collection:', error);
                });
        }
    }, [collectionId, form]);

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

            const payload: CreateGarmentPayload = {
                codigo: data.id || generateId(),
                nombre: data.commercialName,
                descripcion: data.description,
                activo: true,
                imagen: data.image,
                tallas: data.sizes.split(',').map((size) => size.trim()),
                colores: data.colors.split(',').map((color) => color.trim()),

                coleccionId: collectionId || 0,

                materiales: data.rawMaterials?.map((m) => ({
                    materialId: parseInt(m.id),
                    cantidad: m.consumption
                })) || [],

                manoDeObra: data.laborHours && data.laborHours > 0 ? [{
                    accionId: 1,              
                    horas: data.laborHours    
                }] : [],

                mermaCantidad: data.wasteMaterial || 0,
                mermaUnidad: data.wasteUnit || 'm',
                mermaPrecio: data.wastePrice || 0,
            };

            await garmentService.create(payload);

            console.log('✅ Producto creado exitosamente');

            toast.showSuccess('✅ Producto creado exitosamente!');
            setActiveTab(0);
            form.reset();
            router.back();

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
        isSubmitting,
        submitError,
        submit: form.handleSubmit(handleSubmit),

    };
};
