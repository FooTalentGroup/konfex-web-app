"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, X } from "lucide-react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import SearchBar from "@/components/common/SearchBar";
import ClientCard from "@/components/clients/ClientCard";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useClients } from "@/hooks/useClients";

export default function ClientsPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { clients, loading, filterClients, deleteClient } = useClients();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterClients(value);
  };

  const handleCardInteraction = (id: number) => {
    if (isSelectionMode) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      router.push(`/clients/${id}`);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteClient(id);
      }
      setIsSelectionMode(false);
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0F5] font-sans">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-500">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Eliminar clientes"
        message={`¿Estás seguro de que deseas eliminar ${
          selectedIds.length
        } cliente${
          selectedIds.length > 1 ? "s" : ""
        }? Esta acción no se puede deshacer y se eliminarán todos los datos asociados.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-primary-500 mt-8">
          <div className="flex flex-col text-[#F3F0F5]">
            <h1 className="text-[24px] font-lato font-normal mb-1 leading-tight">
              Cliente
            </h1>
            <p className="text-[12px] font-lato font-normal mb-4 sm:mb-6">
              {isSelectionMode
                ? "Selecciona los clientes a eliminar"
                : "Gestiona a todos tus clientes desde aquí."}
            </p>
          </div>
          <SearchBar
            placeholder="Buscar cliente por nombre"
            value={searchTerm}
            onChange={handleSearch}
            onClear={() => handleSearch("")}
            className="w-full"
          />
        </div>

        <main className="flex-1 rounded-t-3xl p-4 sm:p-6 bg-white">
          <div className="w-full max-w-md sm:max-w-lg mx-auto space-y-3 sm:space-y-4">
            {clients.length > 0 ? (
              clients.map((client) => (
                <ClientCard
                  key={client.id}
                  name={client.nombre}
                  source={
                    client.origen?.toLowerCase() === "telegram"
                      ? "telegram"
                      : "manual"
                  }
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedIds.includes(client.id)}
                  onClick={() => handleCardInteraction(client.id)}
                  onBudgetClick={() =>
                    router.push(`/buggets?client=${client.id}`)
                  }
                  onTelegramClick={() => {}}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Search size={40} className="opacity-20" />
                <p className="text-sm">No se encontraron clientes.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-[#C4B5D0] p-2.5 rounded-full shadow-xl z-50 gap-2.5">
        {isSelectionMode ? (
          <>
            <button
              onClick={toggleSelectionMode}
              className="w-12 h-12 bg-[#8B709D] rounded-full text-white flex items-center justify-center hover:bg-[#7A5F89] transition-colors"
            >
              <X size={22} />
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedIds.length > 0
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-300 text-white/50"
              }`}
            >
              <Trash2 size={22} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/clients/new")}
              className="w-12 h-12 bg-[#8B709D] rounded-full text-white flex items-center justify-center hover:bg-[#7A5F89] transition-colors"
            >
              <Plus size={24} />
            </button>
            <button
              onClick={toggleSelectionMode}
              className="w-12 h-12 bg-[#8B709D] rounded-full text-white flex items-center justify-center hover:bg-[#7A5F89] transition-colors"
            >
              <Trash2 size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
