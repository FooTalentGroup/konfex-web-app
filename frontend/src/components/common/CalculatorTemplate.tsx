"use client"
import { useForm, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BudgetForm from '../ui/BudgetForm'
import PriceSummaryCard from '../ui/PriceSummaryCard'
import { useBudgetCalculator } from "@/hooks/useBudgetCalculator";
import { useBudgetExport } from "@/hooks/useBudgetExport";
import { BudgetFormData, BudgetSchema } from "@/types/IBudget";
import { useBudgetMetadata } from "@/hooks/useBudgetMetadata";


function CalculatorTemplate() {
    const form = useForm<BudgetFormData>({
        resolver: zodResolver(BudgetSchema),
        defaultValues: {
            profitabilityPercentage: 0,
            laborHours: 0,
            materialQuantity: 0
        },
        mode: "onChange"
    });

    const { watch, getValues, formState } = form;

    const metadata = useBudgetMetadata();
    const calculations = useBudgetCalculator(watch);

    const {
        laborTotal,
        materialsTotal,
        subtotal,
        profitAmount,
        grandTotal
    } = calculations;

    const { handleSendBudget, handleSavePDF } = useBudgetExport(
        getValues,
        calculations,
        metadata,
        formState
    );

    return (
        <div className="max-w-xl mx-auto bg-primary-500">
            <PriceSummaryCard
                total={grandTotal}
                costs={subtotal}
                profit={profitAmount}
                onSend={handleSendBudget}
                onSavePDF={handleSavePDF}
            />
            <BudgetForm form={form} metadata={metadata} />
        </div>
    )
}

export default CalculatorTemplate