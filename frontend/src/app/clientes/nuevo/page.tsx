'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useClients } from '@/hooks/useClients';

type FormData = {
  name: string;
  identification: string;
  email: string;
  address: string;
  phone: string;
};

export default function NewClientPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { createClient } = useClients();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const newClient = await createClient({
        nombre: data.name,
        telefono: data.phone,
        email: data.email,
        direccion: data.address,
        numeroIdentificacion: data.identification,
        origen: 'manual',
      });
      
      if (newClient) {
        router.push(`/clientes/${newClient.id}`);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-primary-500">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      <div className="w-full px-4 py-3 bg-white rounded-t-3xl rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1 text-base text-gray-600">
            <span>Cliente</span>
            <ChevronRight size={16} />
            <span className="text-[#C071F4] font-bold">Nuevo cliente</span>
          </div>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Descartar cliente"
        message="¿Estás seguro de que deseas descartar este nuevo cliente? Los datos no se guardarán."
        confirmText="Sí, descartar"
        cancelText="Cancelar"
        isDangerous={true}
        isLoading={false}
        onConfirm={() => router.back()}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />

      <div className="flex-1 w-full px-4 py-6 bg-gray-100">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="w-full bg-white rounded-3xl overflow-hidden">
            <div className="w-full bg-gray-50 border-b border-gray-200">
              <div className="flex px-4">
                <button 
                  className="flex-1 py-4 text-center text-sm font-bold text-[#C071F4] relative"
                >
                  Detalle
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#C071F4]"></div>
                </button>
              </div>
            </div>

            <div className="px-4 py-6 bg-gray-50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nombre del cliente</label>
                  <input 
                    {...register("name", { required: true })}
                    placeholder="Ingresa el nombre"
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                  />
                  {errors.name && <span className="text-red-400 text-xs">Este campo es requerido</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nº de Identificación</label>
                  <input 
                    {...register("identification")}
                    placeholder="DNI"
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">E-mail</label>
                  <input 
                    {...register("email")}
                    type="email"
                    placeholder="usuario@gmail.com"
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Dirección</label>
                  <input 
                    {...register("address")}
                    placeholder="Dirección del cliente"
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Teléfono</label>
                  <input 
                    {...register("phone")}
                    placeholder="Ej. +35 261 458 6918"
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-gray-900 text-sm outline-none focus:border-[#C071F4] focus:ring-0 transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-[#E8D5F2] text-[#8B709D] font-bold py-3 rounded-full hover:bg-[#dcc5ee] transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#C071F4] text-white font-bold py-3 rounded-full hover:bg-[#ae5ce6] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}