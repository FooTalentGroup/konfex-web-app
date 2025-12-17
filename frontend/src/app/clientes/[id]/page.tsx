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
import { Cliente } from "@/services/cliente.service";

type ClientForm = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  numeroIdentificacion: string;
};

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
  const [pendingData, setPendingData] = useState<ClientForm | null>(null);
  const [history, setHistory] = useState<PresupuestoResponseDto[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const { getClientById, updateClient, deleteClient } = useClients();
  const [client, setClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientForm>({
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      numeroIdentificacion: "",
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
            numeroIdentificacion: clientData.numeroIdentificacion || "",
          });
        }
      } catch (err) {
        setError("Error al cargar cliente");
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
    } finally {
      setHistoryLoading(false);
    }
  };

  const onSubmit = async (data: ClientForm) => {
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
        numeroIdentificacion: pendingData.numeroIdentificacion,
      });

      const updatedClient = await getClientById(clientId);
      setClient(updatedClient);
      setIsUpdateDialogOpen(false);
      setPendingData(null);

      showSuccess("¡Cambios guardados exitosamente!", 2000);

      setTimeout(() => {
        router.push("/clients");
      }, 1500);
    } catch (err) {
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
      router.push("/clients");
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-primary-500">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      <div className="w-full px-4 py-3 bg-white rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1 text-base ml-auto">
            <span className="text-[#D9B7E8]">Cliente</span>
            <ChevronRight size={16} className="text-[#D9B7E8]" />
            <span className="text-[#9D52B8] font-bold">Detalle cliente</span>
          </div>
        </div>
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

      {/* Contenido */}
      <div className="flex-1 w-full px-4 py-6 bg-gray-100">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="bg-gray-100 border border-[#D9B7E8] rounded-lg px-3 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-gray-700 text-base font-normal">Nombre:</p>
                <p className="text-gray-700 text-base font-normal">ID:</p>
              </div>
              <div className="flex flex-col gap-2 text-right flex-shrink-0">
                <p className="text-gray-900 font-bold text-base">
                  {client?.nombre || "-"}
                </p>
                <p className="text-gray-900 font-bold text-base">
                  {client ? String(client.id).padStart(6, "0") : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
            {/* Tabs */}
            <div className="w-full border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("detail")}
                  className={`flex-1 py-4 text-center text-sm font-bold transition-colors relative ${
                    activeTab === "detail" ? "text-[#C071F4]" : "text-gray-400"
                  }`}
                >
                  Detalle
                  {activeTab === "detail" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C071F4]"></div>
                  )}
                </button>
                <div className="w-px bg-[#E8E5ED] h-8 my-auto"></div>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-4 text-center text-sm font-bold transition-colors relative ${
                    activeTab === "history" ? "text-[#C071F4]" : "text-gray-400"
                  }`}
                >
                  Historial
                  {activeTab === "history" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C071F4]"></div>
                  )}
                </button>
              </div>
            </div>

            <div className="px-4 py-6">
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
                  {activeTab === "detail" && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="animate-in fade-in duration-300 space-y-4"
                    >
                      <div className="bg-gray-100 border border-[#D9B7E8] rounded-lg p-3 space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-normal text-gray-700">
                            Nombre del cliente
                          </label>
                          <input
                            {...register("nombre")}
                            className="w-full bg-white border border-[#D9B7E8] rounded-lg px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-normal text-gray-700">
                            Nº de Identificación
                          </label>
                          <input
                            {...register("numeroIdentificacion")}
                            className="w-full bg-white border border-[#D9B7E8] rounded-lg px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-normal text-gray-700">
                            E-mail
                          </label>
                          <input
                            {...register("email")}
                            className="w-full bg-white border border-[#D9B7E8] rounded-lg px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-normal text-gray-700">
                            Dirección
                          </label>
                          <input
                            {...register("direccion")}
                            className="w-full bg-white border border-[#D9B7E8] rounded-lg px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-normal text-gray-700">
                            Teléfono
                          </label>
                          <input
                            {...register("telefono")}
                            className="w-full bg-white border border-[#D9B7E8] rounded-lg px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="flex-1 bg-[#E8D5F2] text-[#9D52B8] font-bold py-4 rounded-full border-2 border-[#9D52B8] hover:bg-[#dcc5ee] transition-colors text-base"
                        >
                          Eliminar
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[#C071F4] text-white font-bold py-4 rounded-full border-2 border-[#9D52B8] hover:bg-[#ae5ce6] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
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
                          <p>
                            No hay presupuestos registrados para este cliente
                          </p>
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
        </div>
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
                <p className="text-gray-400 text-xs">Total Final</p>
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
