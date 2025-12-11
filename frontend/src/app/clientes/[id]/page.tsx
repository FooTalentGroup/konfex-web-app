"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Loader2,
} from "lucide-react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useClients } from "@/hooks/useClients";
import { presupuestoService } from "@/services/presupuesto.service";
import { PresupuestoResponseDto } from "@/types/presupuesto.types";
import { useToast } from "@/contexts/ToastContext";

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { showSuccess } = useToast();
  const clientId = Number(params.id);
  const initialTab =
    searchParams?.get("tab") === "history" ? "history" : "detail";

  const [activeTab, setActiveTab] = useState<"detail" | "history">(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [history, setHistory] = useState<PresupuestoResponseDto[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { getClientById, updateClient, deleteClient } = useClients();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
    },
  });

  useEffect(() => {
    const loadClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        if (clientData) {
          setClient(clientData);
          reset({
            nombre: clientData.nombre,
            email: clientData.email || "",
            telefono: clientData.telefono || "",
            direccion: clientData.direccion || "",
          });
        }
      } catch (err) {
        setError("Error al cargar cliente");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId, getClientById]);

  useEffect(() => {
    if (activeTab === "history" && client) {
      loadHistory();
    }
  }, [activeTab, client]);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const allBudgets = await presupuestoService.getAll();
      const clientBudgets = allBudgets.filter(
        (b) => b.cliente?.id === clientId
      );
      setHistory(clientBudgets);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setPendingData(data);
    setIsUpdateDialogOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingData) return;

    setIsSubmitting(true);
    try {
      await updateClient(clientId, {
        nombre: pendingData.nombre,
        email: pendingData.email,
        telefono: pendingData.telefono,
        direccion: pendingData.direccion,
      });

      const updatedClient = await getClientById(clientId);
      setClient(updatedClient);
      setIsUpdateDialogOpen(false);
      setPendingData(null);

      showSuccess("¡Cambios guardados exitosamente!", 2000);

      setTimeout(() => {
        router.push("/clientes");
      }, 1500);
    } catch (err) {
      console.error("Error al guardar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(clientId);
      setIsDeleteDialogOpen(false);
      router.push("/clientes");
    } catch (error) {
      console.error("Error al eliminar:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0F5] font-sans pb-10">
      <div className="relative z-50">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Eliminar cliente"
        message={`¿Estás seguro de que deseas eliminar a ${client?.nombre}? Esta acción no se puede deshacer y se eliminarán todos los datos asociados.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={isUpdateDialogOpen}
        title="Actualizar datos del cliente"
        message="¿Estás seguro de que deseas actualizar los datos de este cliente? Los cambios serán guardados inmediatamente."
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        isDangerous={false}
        isLoading={isSubmitting}
        onConfirm={handleConfirmUpdate}
        onCancel={() => {
          setIsUpdateDialogOpen(false);
          setPendingData(null);
        }}
      />

      <div className="bg-white px-5 pt-4 pb-2 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-[#8B709D]/10 text-[#8B709D] rounded-full hover:bg-[#8B709D]/20 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="flex items-center gap-2 text-sm ml-auto">
            <span className="text-gray-400 font-medium">Cliente</span>
            <ChevronRight size={16} className="text-gray-300" />
            <span className="text-[#C071F4] font-bold text-lg">
              Detalle cliente
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-2 relative z-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#C071F4]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        ) : client ? (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 mt-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-1">Nombre:</p>
                  <p className="text-gray-900 font-bold">{client.nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  {client.origen?.toLowerCase() === "telegram" ? (
                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.257.27-.529.27l.214-3.053 5.56-5.023c.242-.22-.054-.338-.373-.118l-6.869 4.332-2.97-.924c-.645-.207-.658-.645.14-.953l11.591-4.471c.537-.196 1.006.128.832.941z" />
                      </svg>
                      <span className="text-xs font-bold text-blue-700">
                        Telegram
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs font-bold text-gray-700">
                        Manual
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">ID:</p>
                <p className="text-gray-900 font-bold">{client.id}</p>
              </div>
              <button
                onClick={() => router.push(`/presupuestos?cliente=${clientId}`)}
                className="flex items-center gap-1.5 bg-[#F2BB5C] text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm hover:bg-[#d9a54a] transition-all whitespace-nowrap"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Presupuesto</span>
              </button>
            </div>

            <div className="flex border-b border-gray-200 mb-6 relative">
              <button
                onClick={() => setActiveTab("detail")}
                className={`flex-1 pb-3 text-center text-sm font-bold transition-colors relative ${
                  activeTab === "detail" ? "text-[#C071F4]" : "text-gray-400"
                }`}
              >
                Detalle
                {activeTab === "detail" && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C071F4] rounded-t-full shadow-[0_-2px_6px_rgba(192,113,244,0.4)]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 pb-3 text-center text-sm font-bold transition-colors relative ${
                  activeTab === "history" ? "text-[#C071F4]" : "text-gray-400"
                }`}
              >
                Historial
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C071F4] rounded-t-full shadow-[0_-2px_6px_rgba(192,113,244,0.4)]"></div>
                )}
              </button>
            </div>

            {activeTab === "detail" && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 animate-in fade-in duration-300"
              >
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600 ml-1">
                    Nombre del cliente
                  </label>
                  <input
                    {...register("nombre")}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600 ml-1">E-mail</label>
                  <input
                    {...register("email")}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600 ml-1">Teléfono</label>
                  <input
                    {...register("telefono")}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-600 ml-1">
                    Dirección
                  </label>
                  <input
                    {...register("direccion")}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all"
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 bg-[#EADCF5] text-[#8B709D] font-bold py-3.5 rounded-full hover:bg-[#dcc5ee] transition-colors"
                  >
                    Eliminar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#C071F4] text-white font-bold py-3.5 rounded-full hover:bg-[#ae5ce6] shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "history" && (
              <div className="animate-in fade-in duration-300">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#C071F4]" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No hay presupuestos registrados para este cliente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((presupuesto) => (
                      <HistoryAccordion
                        key={presupuesto.id}
                        presupuesto={presupuesto}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function HistoryAccordion({
  presupuesto,
}: {
  presupuesto: PresupuestoResponseDto;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const statusColorMap: Record<string, string> = {
    BORRADOR: "bg-gray-400",
    ENVIADO: "bg-blue-400",
    ACEPTADO: "bg-green-400",
    RECHAZADO: "bg-red-400",
    VENCIDO: "bg-orange-400",
  };
  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("es-AR") : "-";
  const formatCurrency = (v?: number) =>
    v
      ? new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(v)
      : "$0";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="font-bold text-gray-900 text-sm">
            ID: {presupuesto.id}
          </span>
          <span
            className={`${
              statusColorMap[presupuesto.estado] || "bg-gray-400"
            } text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}
          >
            {presupuesto.estado}
          </span>
        </div>
        <ChevronUp
          size={20}
          className={`text-gray-400 transition-transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </div>
      {isOpen && (
        <div className="px-5 pb-5 pt-0">
          <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Presupuesto</p>
              <p className="text-[#C071F4] font-medium">
                P-{new Date(presupuesto.fechaCreacion).getFullYear()}-
                {presupuesto.numeroPresupuesto.toString().padStart(4, "0")}
              </p>
            </div>
            {presupuesto.cliente?.nombre && (
              <div>
                <p className="text-gray-400 text-xs">Cliente</p>
                <p className="text-gray-800 font-medium">
                  {presupuesto.cliente.nombre}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Total Costo</p>
                <p className="text-gray-800 font-bold">
                  {formatCurrency(presupuesto.totalCosto)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Venta</p>
                <p className="text-gray-800 font-bold">
                  {formatCurrency(presupuesto.totalFinal)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Vencimiento</p>
              <p className="text-gray-800 font-medium">
                {formatDate(presupuesto.fechaVencimiento)}
              </p>
            </div>
            {presupuesto.notas && (
              <div>
                <p className="text-gray-400 text-xs">Notas</p>
                <p className="text-gray-800">{presupuesto.notas}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
