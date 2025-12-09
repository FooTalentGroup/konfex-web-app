"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MoreVertical, FileDown, Send, X } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import NavigationTabs from "../ui/NavigationTabs";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";
import { useToast } from "@/contexts/ToastContext";
import BudgetPDF from "./BudgetPDF";

interface BudgetSummaryHeaderProps {
  presupuestoId?: number;
  isEditMode?: boolean;
  origen?: "telegram" | "manual";
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

export default function BudgetSummaryHeader({
  presupuestoId: _presupuestoId,
  isEditMode: _isEditMode,
  origen: _origen,
}: BudgetSummaryHeaderProps = {}) {
  const { control, getValues, watch } = useFormContext();
  const { gastosNegocio } = useGastosNegocio();
  const { showError, showInfo } = useToast();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const materials = useWatch({ control, name: "materials" }) || [];
  const extras = useWatch({ control, name: "extras" }) || [];
  const shippingFee = useWatch({ control, name: "shippingFee" }) || 0;
  const desiredProfit = useWatch({ control, name: "desiredProfit" }) || 0;

  const formData = watch();

  const totalMaterialsCost = materials.reduce((sum: number, item: Material) => {
    const totalQty =
      item.variants?.reduce(
        (qSum: number, v: MaterialVariant) => qSum + (v.quantity || 0),
        0
      ) || 0;
    return sum + totalQty * (item.unitPrice || 0);
  }, 0);

  const totalExtrasCost = extras.reduce((sum: number, item: Extra) => {
    return sum + (item.quantity || 0) * (item.amount || 0);
  }, 0);

  const directCost =
    totalMaterialsCost +
    totalExtrasCost +
    (typeof shippingFee === "number"
      ? shippingFee
      : parseFloat(shippingFee || "0") || 0);

  // Calcular costos indirectos sumando TODOS los porcentajes de gastos de negocio
  const porcentajeTotalGastos = gastosNegocio.reduce(
    (sum, gasto) => sum + gasto.porcentaje,
    0
  );
  const indirectCosts = (directCost * porcentajeTotalGastos) / 100;
  const profit = (directCost * desiredProfit) / 100;
  const grandTotal = directCost + indirectCosts + profit;

  const handleDownloadPDF = async () => {
    // Validar campos obligatorios
    const currentData = getValues();

    if (!currentData.title?.trim()) {
      showError("Por favor ingresa un título para el presupuesto");
      setIsMenuOpen(false);
      return;
    }

    if (!currentData.clientName?.trim()) {
      showError("Por favor ingresa el nombre del cliente");
      setIsMenuOpen(false);
      return;
    }

    if (!materials || materials.length === 0) {
      showError(
        "Por favor agrega al menos un material/prenda antes de descargar el PDF"
      );
      setIsMenuOpen(false);
      return;
    }

    try {
      showInfo("Generando PDF...");
      setIsMenuOpen(false);

      // Crear el documento PDF usando @react-pdf/renderer
      const blob = await pdf(
        <BudgetPDF
          formData={currentData}
          materials={materials}
          extras={extras}
          totalMaterialsCost={totalMaterialsCost}
          grandTotal={grandTotal}
        />
      ).toBlob();

      // Crear un enlace temporal para descargar el PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Presupuesto_${currentData.clientName.replace(
        /\s+/g,
        "_"
      )}_${new Date().toLocaleDateString("es-AR").replace(/\//g, "-")}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar el objeto URL
      URL.revokeObjectURL(url);

      showInfo("PDF descargado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      showError("Error al generar el PDF. Por favor intenta nuevamente.");
    }
  };

  const handleSendToTelegram = () => {
    const data = getValues();
    const message = `🚀 *Presupuesto KONFEX*\n📄 *${
      data.title || "Sin título"
    }*\n👤 *${
      data.clientName || "Cliente"
    }*\n\n💰 Materiales: $${totalMaterialsCost}\n💰 Extras: $${totalExtrasCost}\n🏆 *TOTAL: $${grandTotal}*`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      "https://konfex.app"
    )}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank");
    setIsMenuOpen(false);
  };

  return (
    <div className="relative print:hidden">
      <div className="absolute inset-0 bg-[#8B709D] rounded-b-[30px] shadow-lg z-0 pointer-events-none" />

      <div className="relative z-20 text-white pt-2 pb-12">
        <div className="px-6 mb-6">
          <NavigationTabs />
        </div>

        <div className="text-center px-6 relative">
          <p className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wider">
            Total presupuesto
          </p>

          <h2 className="text-4xl font-bold tracking-tight mb-6">
            ${" "}
            {grandTotal.toLocaleString("es-AR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h2>

          <div className="absolute right-0 top-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full transition-all duration-200 relative z-50 ${
                isMenuOpen
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-3 w-full p-3 hover:bg-[#F4E7FD] rounded-lg text-sm text-gray-700 transition-colors font-medium mt-1 group"
                  >
                    <div className="p-2 bg-[#F3F0F5] text-[#8B709D] rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileDown size={18} />
                    </div>
                    <span>Descargar PDF</span>
                  </button>
                  <button
                    onClick={handleSendToTelegram}
                    className="flex items-center gap-3 w-full p-3 hover:bg-[#F4E7FD] rounded-lg text-sm text-gray-700 transition-colors font-medium mt-1 group"
                  >
                    <div className="p-2 bg-[#F3F0F5] text-[#0088cc] rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Send size={18} className="ml-0.5" />
                    </div>
                    <span>Enviar a Telegram</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-8 text-sm border-t border-white/20 pt-4 mx-4">
            <div>
              <p className="text-white/70 text-xs mb-1 uppercase">
                Gastos del Negocio
              </p>
              <p className="font-bold text-lg">
                $ {indirectCosts.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <p className="text-white/70 text-xs mb-1 uppercase">Ganancias</p>
              <p className="font-bold text-lg">
                $ {profit.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
