import React from 'react';
import { CheckCircle2, Instagram, FileText, Wallet } from 'lucide-react';

interface OrderCardProps {
  id: string;
  name: string;
  orderDate: string;
  deliveryDate: string;
  garmentType: string;
  price: number;
  status: 'pagado' | 'deposito';
}

export default function OrderCard({
  id,
  name,
  orderDate,
  deliveryDate,
  garmentType,
  price,
  status,
}: OrderCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 mb-4 w-full relative">
      
      {/* Header: ID y Estado */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-[#770FBD]">
          ID: {id}
        </h3>
        
        {/* Badges de Estado idénticos a Figma */}
        {status === 'pagado' ? (
          <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
            Pagado <CheckCircle2 size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
            Depósito <Wallet size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Datos del pedido con tipografía Lato */}
      <div className="space-y-2 text-sm text-gray-700 mb-5 font-lato">
        <p className="flex items-baseline">
          <span className="font-bold text-gray-900 w-20">Nombre:</span> 
          <span>{name}</span>
        </p>
        <p className="flex flex-wrap items-baseline">
          <span className="font-bold text-gray-900 mr-1">Encargo:</span> {orderDate} 
          <span className="mx-2 text-gray-300">|</span>
          <span className="font-bold text-gray-900 mr-1">Entrega:</span> {deliveryDate}
        </p>
        <p className="flex items-baseline">
          <span className="font-bold text-gray-900 w-20">Tipo de prenda:</span> 
          <span>{garmentType}</span>
        </p>
        <p className="flex items-baseline">
          <span className="font-bold text-gray-900 w-20">Precio:</span> 
          <span className="font-medium">
             {price > 0 ? price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '00000000$'}
          </span>
        </p>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3">
        {/* Botón Instagram (Rosa pálido) */}
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#FCE4EC] text-[#D81B60] border border-[#F8BBD0] py-2 px-4 rounded-full text-xs font-bold hover:bg-[#F8BBD0] transition-colors">
          <Instagram size={16} /> Instagram
        </button>
        
        {/* Botón Presupuesto (Morado Primary) */}
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#8B709D] text-white py-2 px-4 rounded-full text-xs font-bold hover:bg-[#7A618D] transition-colors shadow-sm">
          <FileText size={16} /> Presupuesto
        </button>
      </div>
    </div>
  );
}