'use client';

import React from 'react';
import Image from 'next/image';

export interface BudgetCardProps {
  id: number;
  numeroPresupuesto: string;
  clienteNombre: string;
  totalVenta: number;
  fechaVencimiento: string | null;
  estado: string;
  onClick?: () => void;
  className?: string;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  numeroPresupuesto,
  clienteNombre,
  totalVenta,
  fechaVencimiento,
  estado,
  onClick,
  className = '',
}) => {
  const isVencido = estado === 'VENCIDO';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 md:px-5 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${className}`}
    >
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center mb-1 flex-wrap" style={{ gap: '12px' }}>
          <span
            style={{
              fontFamily: 'var(--font-lato), sans-serif',
              fontWeight: 700,
              fontSize: '1rem', // Body_M size
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#000000',
            }}
          >
            {numeroPresupuesto}
          </span>
          {isVencido && (
            <span
              className="text-white font-[var(--font-lato),sans-serif] font-medium whitespace-nowrap"
              style={{
                backgroundColor: '#C40841',
                borderRadius: '12px',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                paddingRight: '8px',
                fontSize: '0.75rem',
                lineHeight: '1.25rem',
              }}
            >
              Vencido
            </span>
          )}
        </div>
        <p
          className="truncate"
          style={{
            fontFamily: 'var(--font-lato), sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem', // Small size
            lineHeight: '131%',
            letterSpacing: '0%',
            color: '#000000',
          }}
        >
          {clienteNombre}
        </p>
      </div>
      
      <div className="flex flex-col gap-1 flex-shrink-0 ml-2 sm:ml-4">
        <div className="flex items-center gap-1">
          <Image
            src="/presupuestoPrecio.png"
            alt="Precio"
            width={14}
            height={14}
            className="flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
          />
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-lato), sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem', // Body_S size
              lineHeight: '131%',
              letterSpacing: '0%',
              color: '#B65CF2',
            }}
          >
            {formatCurrency(totalVenta)}
          </span>
        </div>
        {fechaVencimiento && (
          <div className="flex items-center gap-1">
            <Image
              src="/calendarioPresupuesto.png"
              alt="Calendario"
              width={14}
              height={14}
              className="flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
            />
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-lato), sans-serif',
                fontWeight: 400,
                fontSize: '0.875rem', // Small size
                lineHeight: '131%',
                letterSpacing: '0%',
                color: '#0D0A0F',
              }}
            >
              {formatDate(fechaVencimiento)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default BudgetCard;

