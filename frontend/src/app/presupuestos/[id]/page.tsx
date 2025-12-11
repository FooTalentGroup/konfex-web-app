"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import BudgetDetailCard, {
  BudgetDetailData,
} from "@/components/presupuestos/BudgetDetailCard";
import BudgetItemsTable, {
  BudgetItem,
} from "@/components/presupuestos/BudgetItemsTable";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";
import BtnActionsCollection from "@/components/ui/BtnActionsCollection";

const mockBudgetData: BudgetDetailData = {
  id: "000025",
  estado: "Enviado",
  fechaCreacion: "2026-01-02",
  titulo: "Pingui Go - Camisetas Verano",
  clienteNombre: "Fútbol Pingui Go",
  telefono: "+35 261 458 6918",
  email: "fupingui@gmail.com",
  fechaFinalizacion: "2025-10-02",
  validezDias: 7,
};

const mockItems: BudgetItem[] = [
  {
    nombre: 'Camiseta verano "Lirios"',
    talla: "M",
    unidades: 2,
    precioUnitario: 9000,
    total: 18000,
  },
  {
    nombre: "Vectorizar logo",
    talla: "-",
    unidades: 1,
    precioUnitario: 3000,
    total: 3000,
  },
  {
    nombre: "Estampado logo",
    talla: "-",
    unidades: 2,
    precioUnitario: 1250,
    total: 2500,
  },
  {
    nombre: "Envío Mendoza",
    talla: "-",
    unidades: 1,
    precioUnitario: 1250,
    total: 1250,
  },
];

export default function BudgetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, mounted } = useAuth();
  const {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  } = useSidebar();

  const [isEditMode, setIsEditMode] = useState(false);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleTelegramClick = () => {
    console.log("Telegram button clicked");
  };

  const handleDownload = () => {
    console.log("Descargar presupuesto");
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    console.log("Toggle edit mode:", !isEditMode);
  };

  const confirmEdit = () => {
    console.log("Confirmar edición");
    setIsEditMode(false);
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
            <BudgetDetailCard
              data={mockBudgetData}
              onTelegramClick={handleTelegramClick}
            />

            <BudgetItemsTable
              items={mockItems}
              ivaPorcentaje={16}
              total={28710}
            />
          </div>
        </main>

        <BtnActionsCollection.fichaMode
          isDeleteMode={isEditMode}
          toggleDeleteMode={toggleEditMode}
          confirmDeletion={confirmEdit}
          onAddCollection={handleDownload}
        />
      </div>

      <Footer />
    </div>
  );
}
