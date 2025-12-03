'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronUp } from 'lucide-react';

export interface BudgetDetailData {
  id: string;
  estado: string;
  fechaCreacion: string;
  titulo: string;
  clienteNombre: string;
  telefono: string;
  email: string;
  fechaFinalizacion: string;
  validezDias: number;
}

interface BudgetDetailCardProps {
  data: BudgetDetailData;
  onTelegramClick?: () => void;
}

const BudgetDetailCard: React.FC<BudgetDetailCardProps> = ({ data, onTelegramClick }) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'ENVIADO':
        return 'bg-[#683BFD]';
      case 'VENCIDO':
        return 'bg-[#C40841]';
      case 'ACEPTADO':
        return 'bg-green-500';
      case 'RECHAZADO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-[430px] rounded-[20px] shadow-lg overflow-hidden mb-4 bg-[#FEFCFF]">
      <div className="w-full pt-0 pr-5 pb-5 pl-5">
        <div>
          <div className="flex items-end justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-[var(--font-lato),sans-serif] font-bold text-sm sm:text-base md:text-lg text-[#000000] leading-[131%] tracking-[0%]">
                  ID: {data.id}
                </span>
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-[var(--font-lato),sans-serif] font-normal text-[#FEFCFF] leading-[131%] tracking-[0%] ${getEstadoColor(data.estado)}`}>
                  {data.estado}
                </span>
              </div>
            </div>
            <div className="ml-2 shrink-0 flex flex-col items-end">
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mb-1" />
              <span className="font-[var(--font-lato),sans-serif] font-normal text-xs sm:text-sm text-[#000000] leading-[131%] tracking-[0%] whitespace-nowrap">
                Fecha: {formatDate(data.fechaCreacion)}
              </span>
            </div>
          </div>
          <div className="h-px bg-gray-300 w-full mt-2 mb-4 sm:mb-5"></div>
          <div className="flex-1 min-w-0">

            <div className="flex flex-row items-start justify-between gap-2 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%] mb-1">
                  Título presupuesto
                </p>
                <p className="font-[var(--font-lato),sans-serif] font-bold text-base sm:text-lg text-[#B65CF2] leading-[131%] tracking-[0%] break-words">
                  {data.titulo}
                </p>
              </div>
              {onTelegramClick && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onTelegramClick();
                  }}
                  className="flex items-center justify-center gap-1.5 bg-[#C9ECFF] text-[#000000] w-[90px] h-[22px] rounded-lg text-xs font-[var(--font-lato),sans-serif] font-medium hover:bg-[#BBDEFB] transition-colors shrink-0 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onTelegramClick();
                    }
                  }}
                >
                  <Image
                    src="/telegram.png"
                    alt="Telegram"
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5"
                  />
                  <span>Telegram</span>
                </div>
              )}
            </div>

            <div className="mb-2 sm:mb-3">
              <p className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%] mb-1">
                Nombre cliente
              </p>
              <p className="font-[var(--font-lato),sans-serif] font-bold text-base sm:text-lg text-[#B65CF2] leading-[131%] tracking-[0%] break-words">
                {data.clienteNombre}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div>
                <p className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%] mb-1">
                  Teléfono
                </p>
                <p className="font-[var(--font-lato),sans-serif] font-bold text-xs sm:text-sm text-[#0D0A0F] leading-[131%] tracking-[0%] break-words">
                  {data.telefono}
                </p>
              </div>
              <div>
                <p className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%] mb-1">
                  E-mail
                </p>
                <p className="font-[var(--font-lato),sans-serif] font-bold text-xs sm:text-sm text-[#0D0A0F] leading-[131%] tracking-[0%] break-words">
                  {data.email}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-end justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%]">
                  Fecha finalización
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-[var(--font-lato),sans-serif] font-bold text-xs sm:text-sm text-[#0D0A0F] leading-[131%] tracking-[0%]">
                    {formatDate(data.fechaFinalizacion)}
                  </span>
                  <Image
                    src="/calendarioPresupuesto.png"
                    alt="Calendario"
                    width={24}
                    height={24}
                    className="w-6 h-6 p-[3px] [filter:brightness(0)_saturate(100%)_invert(8%)_sepia(8%)_saturate(2000%)_hue-rotate(200deg)_brightness(95%)_contrast(95%)]"
                  />
                </div>
              </div>
              <span className="font-[var(--font-lato),sans-serif] font-normal text-xs text-[#1A151E] leading-[131%] tracking-[0%] mb-[6px]">
                Presupuesto válido {data.validezDias} días
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailCard;

