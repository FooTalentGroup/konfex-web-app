"use client";
import { useEffect, useState, useMemo } from 'react';
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
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    return Number(code);
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
    const formValues = form.watch();

    const [activeTab, setActiveTab] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (collectionId) {
            collectionService.getById(collectionId.toString())
                .then((collection) => {
                    form.setValue('season', collection.nombre, { shouldValidate: true });
                })
                .catch(() => {
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

    const isFormComplete = useMemo(() => {
        const {
            image,
            commercialName,
            sizes,
            colors,
            rawMaterials,
            laborHours,
            laborRate,
            wasteMaterial,
            wastePrice,
            wasteUnit
        } = formValues;

        const hasRequiredFields = !!(
            image &&
            commercialName &&
            sizes &&
            colors &&
            laborHours &&
            laborRate &&
            wasteMaterial &&
            wastePrice &&
            wasteUnit
        );

        const hasMaterials = rawMaterials && rawMaterials.length > 0;

        return hasRequiredFields && hasMaterials;

    }, [formValues]);

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
            const payload: CreateGarmentPayload = {
                codigo: data.id || generateId(),
                nombre: data.commercialName,
                descripcion: data.description,
                activo: true,
                imagen: data.image,
                tallas: data.sizes,
                colores: data.colors,
                precio: data.price,

                coleccionId: collectionId || 0,

                materiales: data.rawMaterials?.map((m) => ({
                    materialId: parseInt(String(m.id), 10),
                    cantidad: Number(m.consumption),
                })) || [],

                tarifaCosto: data.laborRate || 0,
                tarifaHoras: data.laborHours || 0,

                mermaCantidad: data.wasteMaterial || 0,
                mermaUnidad: data.wasteUnit || 'm',
                mermaPrecio: data.wastePrice || 0,
            };

            await garmentService.create(payload);

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
        isFormComplete,
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
