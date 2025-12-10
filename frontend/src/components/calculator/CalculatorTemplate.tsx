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

interface MaterialVariant {
  size: string;
  quantity: number;
}

interface Material {
  productoId?: number;
  name: string;
  unitPrice: number;
  variants: MaterialVariant[];
}

interface Extra {
  name: string;
  quantity: number;
  amount: number;
}

interface CalculatorFormData {
  title: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  deliveryDate: string;
  desiredProfit: number;
  gastosNegocioId?: number;
  clienteId?: number;
  materials: Material[];
  extras: Extra[];
  observations?: string;
  shippingFee?: number;
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

  // Detectar origen desde URL params (para presupuestos nuevos desde Telegram)
  const origenFromUrl = searchParams?.get("origen") as
    | "telegram"
    | "manual"
    | null;
  const [budgetSource, setBudgetSource] = useState<"telegram" | "manual">(
    origenFromUrl || "manual"
  );
  const [isLoading, setIsLoading] = useState(isEditMode);

  const methods = useForm<CalculatorFormData>({
    defaultValues: {
      title: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      deliveryDate: "",
      desiredProfit: 0,
      gastosNegocioId: undefined,
      clienteId: undefined,
      materials: [] as Material[],
      extras: [] as Extra[],
      observations: "",
      shippingFee: undefined,
    },
    mode: "onChange",
  });

  const { gastosNegocio } = useGastosNegocio();

  // Establecer automáticamente el primer gasto de negocio cuando se cargan los gastos
  useEffect(() => {
    if (gastosNegocio.length > 0 && !isEditMode) {
      const currentGastosNegocioId = methods.getValues("gastosNegocioId");
      // Solo establecer si no hay uno ya seleccionado
      if (!currentGastosNegocioId) {
        // Usar el primer gasto de negocio disponible
        const firstGastosNegocio = gastosNegocio[0];
        if (firstGastosNegocio) {
          methods.setValue("gastosNegocioId", firstGastosNegocio.id, {
            shouldValidate: false,
          });
        }
      }
    }
  }, [gastosNegocio, isEditMode, methods]);

  // Cargar datos del presupuesto si estamos en modo edición
  useEffect(() => {
    if (isEditMode && presupuestoId && gastosNegocio.length > 0) {
      const loadPresupuesto = async () => {
        try {
          setIsLoading(true);
          showInfo("Cargando presupuesto...");
          const presupuesto = await presupuestoService.getById(presupuestoId);
          const formData = loadPresupuestoToForm(presupuesto, gastosNegocio);

          // Establecer el origen del presupuesto
          setBudgetSource(presupuesto.origen || "manual");

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
      <div className="w-full max-w-full sm:max-w-[480px] mx-auto font-lato pb-12 px-0 sm:px-0 overflow-x-hidden">
        <BudgetSummaryHeader
          presupuestoId={presupuestoId}
          isEditMode={isEditMode}
          origen={budgetSource}
        />

        <div className="-mt-5 relative z-10 shadow-lg rounded-t-[20px] bg-white/95 backdrop-blur-sm overflow-hidden">
          <CalculatorTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="bg-[#F4E7FD] min-h-[640px] sm:min-h-[520px]">
            {activeTab === "details" && <BudgetDetails source={budgetSource} />}
            {activeTab === "materials" && <BudgetMaterials />}
            {activeTab === "extras" && (
              <BudgetExtras
                presupuestoId={presupuestoId}
                isEditMode={isEditMode}
                origen={budgetSource}
              />
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
