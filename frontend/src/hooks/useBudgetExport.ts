import { UseFormGetValues } from "react-hook-form";
import { BudgetFormData } from "@/types/IBudget";

interface BudgetExportData {
    // general
    budgetInfo: {
        id: string;
        date: string;
        title: string;
        clientName?: string;
        clientId?: string;
        startDate?: string;
        finishDate?: string;
        profitabilityPercentage: number;
    };

    // labor
    labor: {
        laborOrder?: string;
        laborRate?: number;
        laborHours?: number;
        laborTotal: number;
    };

    // materials
    materials: {
        materialName: string;
        materialSize?: string;
        materialQuantity?: number;
        materialPrice?: number;
        additionalCost?: string;
        materialsCost?: number;
        materialsTotal: number;
    };

    // prices summary
    summary: {
        subtotal: number;
        profitAmount: number;
        grandTotal: number;
    };
}

export function useBudgetExport(
    getValues: UseFormGetValues<BudgetFormData>,
    calculations: {
        laborTotal: number;
        materialsTotal: number;
        subtotal: number;
        profitAmount: number;
        grandTotal: number;
    },
    metadata: { id: string; date: string },
    formState: { isValid: boolean; errors: any }
) {
    const exportBudgetData = (): BudgetExportData => {
        const formData = getValues();

        const exportData: BudgetExportData = {
            budgetInfo: {
                id: metadata.id,
                date: metadata.date,
                title: formData.title,
                clientName: formData.clientName,
                clientId: formData.clientId,
                startDate: formData.startDate,
                finishDate: formData.finishDate,
                profitabilityPercentage: formData.profitabilityPercentage || 0,
            },

            labor: {
                laborOrder: formData.laborOrder,
                laborRate: formData.laborRate,
                laborHours: formData.laborHours,
                laborTotal: calculations.laborTotal,
            },

            materials: {
                materialName: formData.materialName,
                materialSize: formData.materialSize,
                materialQuantity: formData.materialQuantity,
                materialPrice: formData.materialPrice,
                additionalCost: formData.additionalCost,
                materialsCost: formData.materialsCost,
                materialsTotal: calculations.materialsTotal,
            },

            summary: {
                subtotal: calculations.subtotal,
                profitAmount: calculations.profitAmount,
                grandTotal: calculations.grandTotal,
            },
        };

        return exportData;
    };

    const handleSendBudget = () => {

        if (!formState.isValid) {
            console.log("❌ FORMULARIO INCOMPLETO - Por favor completa todos los campos requeridos");
            console.log("Errores:", formState.errors);

            alert("Por favor completa todos los campos requeridos antes de enviar");
            return null;
        }

        const data = exportBudgetData();
        console.log("=== DATOS COMPLETOS DEL PRESUPUESTO ===");
        console.log(JSON.stringify(data, null, 2));

        return data;
    };

    const handleSavePDF = () => {

        if (!formState.isValid) {
            console.log("❌ FORMULARIO INCOMPLETO - Por favor completa todos los campos requeridos");
            console.log("Errores:", formState.errors);

            alert("Por favor completa todos los campos requeridos antes de guardar el PDF");
            return null;
        }

        const data = exportBudgetData();
        console.log("=== GENERANDO PDF ===");
        console.log(JSON.stringify(data, null, 2));

        return data;
    };

    return {
        exportBudgetData,
        handleSendBudget,
        handleSavePDF,
    };
}
