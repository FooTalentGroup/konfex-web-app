'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface BudgetItem {
  nombre: string;
  talla: string;
  unidades: number;
  precioUnitario: number;
  total: number;
}

interface BudgetItemsTableProps {
  items: BudgetItem[];
  ivaPorcentaje?: number;
  total?: number;
}

const BudgetItemsTable: React.FC<BudgetItemsTableProps> = ({
  items,
  ivaPorcentaje = 16,
  total,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const ivaAmount = (subtotal * ivaPorcentaje) / 100;
  const finalTotal = total || subtotal + ivaAmount;

  return (
    <div className="w-full max-w-[430px] rounded-[20px] shadow-lg overflow-hidden mb-4 bg-[#FEFCFF]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full pt-0 pr-5 pb-5 pl-5 text-left focus:outline-none"
        type="button"
      >
        <div>
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0"></div>
            <div className="ml-2 shrink-0 flex flex-col items-end">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mb-1" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mb-1" />
              )}
            </div>
          </div>
          <h3 className="font-[var(--font-lato),sans-serif] font-bold text-sm sm:text-base text-black -mt-2">
            Descripción
          </h3>
          <div className="h-px bg-[#EDE9F1] w-full mb-0 mt-2"></div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 -mt-1">
          <div className="w-full">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-1 text-xs font-[var(--font-lato),sans-serif] font-bold text-[#1A151E] leading-[131%] tracking-[0%]">
                    Nombre
                  </th>
                  <th className="text-center py-2 px-1 text-xs font-[var(--font-lato),sans-serif] font-bold text-[#1A151E] leading-[131%] tracking-[0%] bg-[#EDE9F1]">
                    Talla
                  </th>
                  <th className="text-center py-2 px-1 text-xs font-[var(--font-lato),sans-serif] font-bold text-[#1A151E] leading-[131%] tracking-[0%]">
                    Uds.
                  </th>
                  <th className="text-center py-2 px-1 text-xs font-[var(--font-lato),sans-serif] font-bold text-[#1A151E] leading-[131%] tracking-[0%] bg-[#EDE9F1]">
                    Precio/Ud.
                  </th>
                  <th className="text-center py-2 pl-1 pr-4 text-xs font-[var(--font-lato),sans-serif] font-bold text-[#1A151E] leading-[131%] tracking-[0%]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="py-2 pl-2 pr-1 text-xs font-[var(--font-lato),sans-serif] font-normal text-[#1A151E] leading-[131%] tracking-[0%] break-words">
                      {item.nombre}
                    </td>
                    <td className="py-2 px-1 text-center text-xs font-[var(--font-lato),sans-serif] font-normal text-[#1A151E] leading-[131%] tracking-[0%] bg-[#EDE9F1]">
                      {item.talla === '-' ? '-' : item.talla}
                    </td>
                    <td className="py-2 px-1 text-center text-xs font-[var(--font-lato),sans-serif] font-normal text-[#1A151E] leading-[131%] tracking-[0%]">
                      {item.unidades}
                    </td>
                    <td className="py-2 px-1 text-right text-xs font-[var(--font-lato),sans-serif] font-normal text-[#1A151E] leading-[131%] tracking-[0%] bg-[#EDE9F1]">
                      $ {formatCurrency(item.precioUnitario)}
                    </td>
                    <td className="py-2 pl-1 pr-4 text-right text-xs font-[var(--font-lato),sans-serif] font-normal text-[#1A151E] leading-[131%] tracking-[0%]">
                      $ {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-1 sm:mt-2 pt-1 sm:pt-2">
            <div className="flex justify-end items-center gap-2 mb-2">
              <span className="font-[var(--font-lato),sans-serif] font-normal text-xs text-black">
                IVA%
              </span>
              <span className="font-[var(--font-lato),sans-serif] font-normal text-xs text-black w-[60px] text-right">
                {ivaPorcentaje}%
              </span>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="font-[var(--font-lato),sans-serif] font-bold text-sm text-black">
                Total
              </span>
              <span className="font-[var(--font-lato),sans-serif] font-bold text-sm text-[#B65CF2] w-[60px] text-right">
                $ {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetItemsTable;

