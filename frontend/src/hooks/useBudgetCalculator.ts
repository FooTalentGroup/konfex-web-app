import { useMemo } from "react";
import { UseFormWatch } from "react-hook-form";
import { BudgetFormData } from "@/types/IBudget";

export function useBudgetCalculator(watch: UseFormWatch<BudgetFormData>) {

    const laborRate = watch("laborRate") || 0;
    const laborHours = watch("laborHours") || 0;

    const materialPrice = watch("materialPrice") || 0;
    const materialQuantity = watch("materialQuantity") || 0;
    const materialsCost = watch("materialsCost") || 0;

    const profitability = watch("profitabilityPercentage") || 0;

    const calculations = useMemo(() => {
        const laborTotal = laborRate * laborHours;

        const materialsTotal = (materialPrice * materialQuantity) + (materialsCost || 0);
        const subtotal = laborTotal + materialsTotal;
        const profitAmount = subtotal * (profitability / 100);
        const grandTotal = subtotal + profitAmount;

        return {
            laborTotal,
            materialsTotal,
            subtotal,
            profitAmount,
            grandTotal,
        };
    }, [
        laborRate,
        laborHours,
        materialPrice,
        materialQuantity,
        materialsCost,
        profitability,
        watch,

    ]);

    return calculations;
}
