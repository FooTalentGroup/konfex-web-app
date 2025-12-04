"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

// Componentes internos
import CalculatorTabs from "./CalculatorTabs";
import BudgetDetails from "./steps/BudgetDetails";
import BudgetMaterials from "./steps/BudgetMaterials";
import BudgetExtras from "./steps/BudgetExtras";

import BudgetSummaryHeader from "./BudgetSummaryHeader";

export default function CalculatorTemplate() {
  const [activeTab, setActiveTab] = useState<
    "details" | "materials" | "extras"
  >("details");

  // TODO: Esto es temporal para pruebas. Reemplazar con la lógica real del origen del presupuesto
  const [budgetSource] = useState<"telegram" | "manual">("telegram");

  const methods = useForm({
    defaultValues: {
      title: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      deliveryDate: "",
      desiredProfit: 0,
      materials: [],
      extras: [],
      observations: "",
    },
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md mx-auto font-lato pb-10">
        <BudgetSummaryHeader />

        <div className="-mt-6 relative z-10 shadow-xl rounded-t-[30px] bg-white overflow-hidden">
          <CalculatorTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="bg-[#F3F0F5] min-h-[500px]">
            {activeTab === "details" && <BudgetDetails source={budgetSource} />}
            {activeTab === "materials" && <BudgetMaterials />}
            {activeTab === "extras" && <BudgetExtras />}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
