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
        origen: 'manual',
      });
      
      if (newClient) {
        router.push(`/clientes/${newClient.id}`);
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F0F5] font-sans pb-6">
      
      <div className="relative z-50">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
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
      

      <header className="bg-white px-4 sm:px-5 pt-4 sm:pt-6 pb-3 sm:pb-4 shadow-sm rounded-b-3xl sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button 
                onClick={() => router.back()}
                className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center bg-[#8B709D] text-white rounded-full shadow-md hover:bg-[#7A608D] transition-colors flex-shrink-0"
            >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm min-w-0">
                <span className="text-gray-400 font-medium truncate">Cliente</span>
                <ChevronRight size={12} className="sm:w-[14px] sm:h-[14px] text-gray-300 flex-shrink-0" />
                <span className="text-[#8B709D] font-bold text-sm sm:text-lg truncate">Nuevo cliente</span>
            </div>
        </div>

        <div className="flex items-center justify-center border-b border-gray-100">
             <div className="pb-2 border-b-2 border-[#C071F4] text-[#C071F4] font-bold text-xs sm:text-sm px-6 sm:px-8">
                Detalle
             </div>
        </div>
      </header>

      <main className="px-4 sm:px-5 mt-4 sm:mt-6 relative z-0">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
            
            {/* Campo: Nombre */}
            <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-600 ml-1">Nombre del cliente</label>
                <input 
                    {...register("name", { required: true })}
                    placeholder="Ingresa el nombre"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all placeholder:text-gray-300"
                />
            {errors.name && <span className="text-red-400 text-xs ml-1">Este campo es requerido</span>}
            </div>

            <div className="space-y-1.5\">
                <label className="text-xs sm:text-sm font-medium text-gray-600 ml-1">Nº de Identificación</label>
                <input 
                    {...register("identification")}
                    placeholder="DNI"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all placeholder:text-gray-300"
                />
            </div>

            <div className="space-y-1.5\">
                <label className="text-xs sm:text-sm font-medium text-gray-600 ml-1">E-mail</label>
                <input 
                    {...register("email")}
                    type="email"
                    placeholder="usuario@gmail.com"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all placeholder:text-gray-300"
                />
            </div>

            <div className="space-y-1.5\">
                <label className="text-xs sm:text-sm font-medium text-gray-600 ml-1">Dirección</label>
                <input 
                    {...register("address")}
                    placeholder="Dirección del cliente"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all placeholder:text-gray-300"
                />
            </div>

             <div className="space-y-1.5\">
                <label className="text-xs sm:text-sm font-medium text-gray-600 ml-1">Teléfono</label>
                <input 
                    {...register("phone")}
                    placeholder="Ej. +35 261 458 6918"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 outline-none focus:border-[#C071F4] focus:ring-1 focus:ring-[#C071F4] transition-all placeholder:text-gray-300"
                />
            </div>

            <div className="pt-3 sm:pt-4 flex gap-2 sm:gap-3\">

                <button 
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-[#EADCF5] text-[#8B709D] font-bold py-2.5 sm:py-3.5 text-xs sm:text-sm rounded-full hover:bg-[#dcc5ee] transition-colors"
                >
                    Eliminar
                </button>


                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#C071F4] text-white font-bold py-2.5 sm:py-3.5 text-xs sm:text-sm rounded-full hover:bg-[#ae5ce6] shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </main>
    </div>
  );
}