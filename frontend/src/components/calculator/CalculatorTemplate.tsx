"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { presupuestoService } from "@/services/presupuesto.service";
import { loadPresupuestoToForm } from "@/utils/presupuestoLoader";
import { useToast } from "@/contexts/ToastContext";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";

// Componentes internos
import CalculatorTabs from "./CalculatorTabs";
import BudgetDetails from "./steps/BudgetDetails";
import BudgetMaterials from "./steps/BudgetMaterials";
import BudgetExtras from "./steps/BudgetExtras";

import BudgetSummaryHeader from "./BudgetSummaryHeader";

interface CalculatorTemplateProps {
  presupuestoId?: number;
}

export default function CalculatorTemplate({
  presupuestoId: propPresupuestoId,
}: CalculatorTemplateProps = {}) {
  const searchParams = useSearchParams();
  const { showError, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState<
    "details" | "materials" | "extras"
  >("details");

  // Obtener presupuestoId de props, searchParams o undefined
  const presupuestoIdFromUrl = searchParams?.get("id")
    ? parseInt(searchParams.get("id")!, 10)
    : undefined;
  const presupuestoId = propPresupuestoId || presupuestoIdFromUrl;
  const isEditMode = !!presupuestoId;

  // TODO: Esto es temporal para pruebas. Reemplazar con la lógica real del origen del presupuesto
  const [budgetSource] = useState<"telegram" | "manual">("telegram");
  const [isLoading, setIsLoading] = useState(isEditMode);

  const methods = useForm({
    defaultValues: {
      title: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      deliveryDate: "",
      desiredProfit: 0,
      gastosNegocioId: undefined as number | undefined,
      clienteId: undefined as number | undefined,
      materials: [],
      extras: [],
      observations: "",
      shippingFee: 0,
    },
    mode: "onChange",
  });

  const { gastosNegocio } = useGastosNegocio();

  // Cargar datos del presupuesto si estamos en modo edición
  useEffect(() => {
    if (isEditMode && presupuestoId && gastosNegocio.length > 0) {
      const loadPresupuesto = async () => {
        try {
          setIsLoading(true);
          showInfo("Cargando presupuesto...");
          const presupuesto = await presupuestoService.getById(presupuestoId);
          const formData = loadPresupuestoToForm(presupuesto, gastosNegocio);

          // Resetear el formulario con los datos cargados
          methods.reset(formData);
        } catch (error) {
          console.error("Error al cargar presupuesto:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al cargar el presupuesto";
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      loadPresupuesto();
    }
  }, [presupuestoId, isEditMode, methods, showError, showInfo, gastosNegocio]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto font-lato pb-10 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B709D] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-md mx-auto font-lato pb-10">
        <BudgetSummaryHeader
          presupuestoId={presupuestoId}
          isEditMode={isEditMode}
        />

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
