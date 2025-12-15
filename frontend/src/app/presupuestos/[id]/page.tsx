"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import BudgetDetailCard from "@/components/presupuestos/BudgetDetailCard";
import BudgetItemsTable from "@/components/presupuestos/BudgetItemsTable";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { useBudgetDetail } from "@/hooks/useBudgetDetail";
import Image from "next/image";
import BtnActionsCollection from "@/components/ui/BtnActionsCollection";
import BudgetPDF from "@/components/calculator/BudgetPDF";
import { pdf } from "@react-pdf/renderer";
import {
  mapPresupuestoToBudgetDetail,
  mapPresupuestoToBudgetItems,
  calcularIVAPorcentaje,
} from "@/utils/presupuestoDetailMapper";
import { presupuestoService } from "@/services/presupuesto.service";
import { useToast } from "@/contexts/ToastContext";

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, mounted } = useAuth();
  const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  } = useSidebar();
  const { showSuccess, showError, showInfo } = useToast();

  const budgetId = Number(params.id);
  const { budget, isLoading, error } = useBudgetDetail(budgetId);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleDownload = async () => {
    if (!budget) return;

    try {
      const items = mapPresupuestoToBudgetItems(budget);

      const materials = items
        .filter((item) => item.talla !== "-")
        .map((item) => ({
          name: item.nombre,
          unitPrice: item.precioUnitario,
          variants: [
            {
              size: item.talla,
              quantity: item.unidades,
            },
          ],
        }));

      const extras = items
        .filter((item) => item.talla === "-")
        .map((item) => ({
          name: item.nombre,
          quantity: item.unidades,
          amount: item.precioUnitario,
        }));

      const totalMaterialsCost = items
        .filter((item) => item.talla !== "-")
        .reduce((sum, item) => sum + item.total, 0);

      const formData = {
        id: budget.numeroPresupuesto,
        title: budget.nombre || "Sin título",
        clientName: budget.cliente?.nombre || "Sin cliente",
        clientEmail: budget.cliente?.email || "",
        clientPhone: budget.cliente?.telefono || "",
        deliveryDate: budget.fechaVencimiento || budget.fechaCreacion,
        observations: budget.notas || "",
      };

      const blob = await pdf(
        <BudgetPDF
          formData={formData}
          materials={materials}
          extras={extras}
          totalMaterialsCost={totalMaterialsCost}
          grandTotal={budget.totalFinal}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Presupuesto_${
        budget.nombre?.replace(/\s+/g, "_") || "Sin_titulo"
      }_${budget.numeroPresupuesto.toString().padStart(6, "0")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      showError("Error al generar el PDF");
    }
  };

  const handleEdit = () => {
    if (!budget) return;
    router.push(`/calculator?id=${budget.id}`);
  };

  const handleOpenTelegram = async () => {
    if (!budget) return;

    if (budget.origen === "telegram") {
      await handleDownload();

      if (budget.clienteId) {
        router.push(`/inbox/chat/${budget.clienteId}`);
      } else {
        router.push("/inbox");
      }
    } else {
      handleDownload();
    }
  };

  const handleConvertToPedido = async () => {
    if (!budget) return;

    if (budget.pedido) {
      showInfo("Este presupuesto ya tiene un pedido asociado. Redirigiendo...");
      router.push("/pedidos");
      return;
    }

    try {
      if (budget.estado !== "ACEPTADO") {
        showInfo("Aceptando presupuesto y convirtiéndolo en pedido...");

        await presupuestoService.partialUpdate(budget.id, {
          estado: "ACEPTADO",
        });
      } else {
        showInfo("Convirtiendo presupuesto en pedido...");

        await presupuestoService.partialUpdate(budget.id, {
          estado: "ACEPTADO",
        });
      }

      const updatedBudget = await presupuestoService.getById(budget.id);

      if (updatedBudget.pedido) {
        showSuccess("¡Pedido creado exitosamente!");
        setTimeout(() => {
          router.push("/pedidos");
        }, 1000);
      } else {
        showError("Error al crear el pedido. Por favor intenta nuevamente.");
      }
    } catch (error) {
      showError("Error al convertir el presupuesto en pedido");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#E6E1EA] overflow-hidden max-h-screen">
      <Header onMenuClick={openSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="pb-2 shrink-0">
          <div className="rounded-b-[16px] w-full pb-2 bg-white">
            <div className="w-full max-w-[430px] mx-auto px-5">
              <div className="flex items-center gap-2 sm:gap-3 py-2">
                <button
                  onClick={() => router.back()}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shrink-0 bg-[#9D86AC]"
                >
                  <Image
                    src="/flechaTela.png"
                    alt="Volver"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                  <span className="font-[var(--font-lato),sans-serif] font-normal text-xs sm:text-sm text-[#9D86AC] leading-[131%] tracking-[0%]">
                    Presupuesto
                  </span>
                  <Image
                    src="/flecha.png"
                    alt=""
                    width={12}
                    height={12}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                  />
                  <span className="font-[var(--font-lato),sans-serif] font-bold text-sm sm:text-base md:text-lg text-[#770FBD] leading-[131%] tracking-[0%]">
                    Ficha
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 px-0 pt-2 pb-4 sm:pt-2 sm:pb-6 overflow-y-auto sm:overflow-hidden min-h-0">
          <div className="w-full max-w-[430px] mx-auto">
            {isLoading && (
              <div className="text-center py-12">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  Cargando presupuesto...
                </p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p
                  className="text-red-500 text-sm mb-4"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  {error}
                </p>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-[#9D86AC] text-white rounded-lg hover:opacity-80 transition-opacity"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  Volver
                </button>
              </div>
            )}

            {!isLoading && !error && budget && (
              <>
                <BudgetDetailCard data={mapPresupuestoToBudgetDetail(budget)} />

                <BudgetItemsTable
                  items={mapPresupuestoToBudgetItems(budget)}
                  ivaPorcentaje={calcularIVAPorcentaje(budget)}
                  total={budget.totalFinal}
                />
              </>
            )}
          </div>
        </main>

        {!isLoading && !error && budget && (
          <BtnActionsCollection.fichaMode
            toggleDeleteMode={handleEdit}
            onAddCollection={handleOpenTelegram}
            isTelegramBudget={budget.origen === "telegram"}
            isDeleteMode={false}
            confirmDeletion={handleConvertToPedido}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
