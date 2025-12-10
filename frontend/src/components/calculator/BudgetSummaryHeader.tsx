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
    <>
      <div className="relative print:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="absolute inset-0 bg-[#8B709D] rounded-b-[26px] sm:rounded-b-none shadow-lg z-0 pointer-events-none" />

        <div className="relative z-20 text-white pt-3 pb-10 sm:pb-12">
          <div className="px-6 mb-6">
            <NavigationTabs />
          </div>

          <div className="text-center px-6 relative">
            <p className="text-white text-sm font-normal leading-[1.31] mb-1">
              Total presupuesto
            </p>

            <h2 className="text-white text-[32px] font-bold leading-[1.31] tracking-tight mb-6">
              ${" "}
              {grandTotal.toLocaleString("es-AR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </h2>

            <div className="relative mx-auto w-full max-w-[260px] flex justify-between text-sm pt-4">
              <div className="absolute left-1/2 top-2 h-10 w-px bg-white/25 -translate-x-1/2" />
              <div className="text-left w-[120px] -translate-x-1">
                <p className="text-white text-[12px] font-normal leading-[1.31] mb-1 tracking-wide -translate-x-[8px]">
                  Gastos del negocio
                </p>
                <p className="text-white font-bold text-[18px] translate-x-[10px]">
                  $ {indirectCosts.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="text-left w-[120px] translate-x-10">
                <p className="text-white text-[12px] font-normal leading-[1.31] mb-1 tracking-wide">
                  Ganancias
                </p>
                <p className="text-white font-bold text-[18px]">
                  $ {profit.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA DE IMPRESIÓN PDF */}
      {/* Esta sección está oculta en pantalla (hidden) y solo aparece al imprimir (print:block) */}
      <div className="hidden print:block fixed inset-0 bg-white z-9999 p-8 text-black font-lato overflow-y-auto">
        <div className="flex justify-between items-end border-b-2 border-[#8B709D] pb-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#8B709D] mb-1 tracking-tight">
              KONFEX
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Presupuesto Oficial
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">
              Fecha: {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              ID Ref: {formData.id || "000025"}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
            1. Información del Cliente
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Título Presupuesto</span>
              <span className="font-bold">{formData.title || "-"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Cliente</span>
              <span className="font-bold">{formData.clientName || "-"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Email</span>
              <span>{formData.clientEmail || "-"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Teléfono</span>
              <span>{formData.clientPhone || "-"}</span>
            </div>
            <div className="col-span-2 flex flex-col mt-2">
              <span className="text-gray-500 text-xs">
                Fecha Entrega Estimada
              </span>
              <span className="font-medium">
                {formData.deliveryDate || "-"}
              </span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
            2. Materiales y Prendas
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-2 px-2 font-semibold">Ítem</th>
                <th className="py-2 px-2 font-semibold">Variantes</th>
                <th className="py-2 px-2 text-right font-semibold">
                  Precio U.
                </th>
                <th className="py-2 px-2 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.map((m: Material, i: number) => {
                const qty =
                  m.variants?.reduce(
                    (acc: number, v: MaterialVariant) => acc + v.quantity,
                    0
                  ) || 0;
                return (
                  <tr key={i}>
                    <td className="py-3 px-2 font-medium">{m.name}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      {m.variants
                        ?.map(
                          (v: MaterialVariant) => `${v.size} (${v.quantity}u)`
                        )
                        .join(", ")}
                    </td>
                    <td className="py-3 px-2 text-right">
                      $ {m.unitPrice?.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right font-bold">
                      $ {(qty * m.unitPrice).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {materials.length === 0 && (
            <p className="text-xs text-gray-400 italic mt-2">
              Sin materiales registrados.
            </p>
          )}
          <div className="text-right mt-3 pt-2 border-t border-gray-100 font-bold text-gray-700 text-sm">
            Subtotal Materiales: $ {totalMaterialsCost.toLocaleString()}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-[#8B709D] font-bold uppercase tracking-wider text-sm mb-4 border-b border-gray-100 pb-1">
            3. Costos Adicionales
          </h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-2 px-2 font-semibold">Concepto</th>
                <th className="py-2 px-2 font-semibold">Cant.</th>
                <th className="py-2 px-2 text-right font-semibold">Monto U.</th>
                <th className="py-2 px-2 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {extras.map((e: Extra, i: number) => (
                <tr key={i}>
                  <td className="py-3 px-2 font-medium">{e.name}</td>
                  <td className="py-3 px-2 text-gray-500">{e.quantity}</td>
                  <td className="py-3 px-2 text-right">
                    $ {e.amount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right font-bold">
                    $ {(e.quantity * e.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {extras.length === 0 && (
            <p className="text-xs text-gray-400 italic mt-2">
              Sin costos adicionales.
            </p>
          )}

          {formData.observations && (
            <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-bold mb-1">
                Observaciones:
              </p>
              <p className="text-sm text-gray-700 italic">
                {formData.observations}
              </p>
            </div>
          )}
        </section>

        {/* Totales Finales */}
        <section className="mt-10 pt-6 border-t-2 border-gray-800 flex flex-col items-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-2xl font-bold text-[#8B709D] mt-4 pt-4 border-t border-gray-200">
              <span>TOTAL:</span>
              <span>$ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <div className="fixed bottom-8 left-0 w-full text-center text-xs text-gray-400 print:bottom-8">
          Generado automáticamente por KONFEX App
        </div>
      </div>
    </>
  );
}
