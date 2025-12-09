"use client";

import { useState, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MoreVertical, FileDown, Send, X } from "lucide-react";
import NavigationTabs from "../ui/NavigationTabs";
import { useGastosNegocio } from "@/hooks/useGastosNegocio";
import { useToast } from "@/contexts/ToastContext";

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
  const pdfContentRef = useRef<HTMLDivElement>(null);

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

    // Si todas las validaciones pasan, generar el PDF
    if (!pdfContentRef.current) {
      showError("Error al generar el PDF. Por favor intenta nuevamente.");
      setIsMenuOpen(false);
      return;
    }

    try {
      showInfo("Generando PDF...");
      setIsMenuOpen(false);

      // Importar html2pdf dinámicamente (solo en el cliente)
      const html2pdf = (await import("html2pdf.js")).default;

      // Configuración del PDF
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Presupuesto_${currentData.clientName.replace(
          /\s+/g,
          "_"
        )}_${new Date().toLocaleDateString("es-AR").replace(/\//g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generar y descargar el PDF
      await html2pdf().set(opt).from(pdfContentRef.current).save();
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
                <p className="text-white/70 text-xs mb-1 uppercase">
                  Ganancias
                </p>
                <p className="font-bold text-lg">
                  $ {profit.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA PARA GENERAR PDF */}
      {/* Esta sección está fuera de la pantalla (off-screen) para que html2pdf pueda capturarla */}
      <div
        ref={pdfContentRef}
        className="fixed -left-[9999px] top-0 bg-white p-8 text-black font-lato w-[210mm]"
      >
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
