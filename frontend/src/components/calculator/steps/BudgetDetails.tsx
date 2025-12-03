import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';

export default function BudgetDetails() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 p-5 bg-[#F3F0F5] rounded-b-2xl min-h-[400px]">
      

      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span className="font-bold text-gray-800">ID: 000025</span>
        <div className="flex items-center gap-2">
            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">Manual</span>
            <span>Fecha: 02/01/2026</span>
        </div>
      </div>


      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Título presupuesto</label>
        <input 
          {...register('title')}
          type="text" 
          placeholder="Asigna un título" 
          className="w-full bg-white border-none rounded-lg p-3 text-sm text-gray-700 outline-none shadow-sm placeholder:text-gray-400"
        />
      </div>


      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre cliente</label>
        <input 
          {...register('clientName')}
          type="text" 
          placeholder="Empieza a escribir" 
          className="w-full bg-white border-none rounded-lg p-3 text-sm text-gray-700 outline-none shadow-sm placeholder:text-gray-400"
        />
      </div>


      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">E-mail</label>
        <input 
          {...register('clientEmail')}
          type="email" 
          placeholder="Empieza a escribir" 
          className="w-full bg-white border-none rounded-lg p-3 text-sm text-gray-700 outline-none shadow-sm placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Teléfono</label>
          <input 
            {...register('clientPhone')}
            type="tel" 
            placeholder="965 705 366" 
            className="w-full bg-white border-none rounded-lg p-3 text-sm text-gray-700 outline-none shadow-sm placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Fecha entrega</label>
          <div className="relative">
            <input 
              {...register('deliveryDate')}
              type="text" 
              placeholder="00/00/0000" 
              className="w-full bg-white border-none rounded-lg p-3 pr-10 text-sm text-gray-700 outline-none shadow-sm placeholder:text-gray-400"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        * La fecha de entrega se vuelve a revisar una vez confirmado el presupuesto
      </p>
    </div>
  );
}