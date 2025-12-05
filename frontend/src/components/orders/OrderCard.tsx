'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useOrderCard } from '@/hooks/useOrderCard';

interface OrderCardProps {
  id: string;
  name: string;
  orderDate: string;
  deliveryDate: string;
  garmentType: string;
  price: number;
  status: 'pagado' | 'deposito';
  operativoStatus?: 'presupuesto' | 'en compra' | 'en produccion' | 'entregado';
  telegramChatId?: string;
}

export default function OrderCard({
  id,
  name,
  orderDate,
  deliveryDate,
  garmentType,
  price,
  status,
  operativoStatus = 'presupuesto',
  telegramChatId,
}: OrderCardProps) {
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isOperativoDropdownOpen, setIsOperativoDropdownOpen] = useState(false);
  const paymentDropdownRef = useRef<HTMLDivElement>(null);
  const operativoDropdownRef = useRef<HTMLDivElement>(null);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<'pagado' | 'deposito'>(status);
  const [currentOperativoStatus, setCurrentOperativoStatus] = useState<'presupuesto' | 'en compra' | 'en produccion' | 'entregado'>(operativoStatus);
  const [isSelected, setIsSelected] = useState(false);

  const {
    showMessageInput,
    message,
    setMessage,
    isSending,
    sendTelegramMessage,
    handleTelegramClick,
    handleCancel,
    handleKeyPress,
  } = useOrderCard({ telegramChatId });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false);
      }
      if (operativoDropdownRef.current && !operativoDropdownRef.current.contains(event.target as Node)) {
        setIsOperativoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string | null }>).detail;
      if (!detail) return;
      if (detail.id !== id) {
        setIsSelected(false);
      }
    };
    window.addEventListener('order-card-selected', handleSelected as EventListener);
    return () => window.removeEventListener('order-card-selected', handleSelected as EventListener);
  }, [id]);

  const handleCardClick = () => {
    if (isSelected) {
      setIsSelected(false);
      window.dispatchEvent(new CustomEvent('order-card-selected', { detail: { id: null } }));
    } else {
      setIsSelected(true);
      window.dispatchEvent(new CustomEvent('order-card-selected', { detail: { id } }));
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`rounded-[8px] shadow-sm border border-[#AA42F0] w-full relative p-3 sm:p-4 md:p-5 mt-0 mb-2 ${
        isSelected ? 'bg-[#F3F0F5]' : 'bg-[#FEFCFF]'
      }`}
    >
      
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h3 className="font-lato font-bold not-italic text-sm sm:text-base leading-[131%] tracking-normal text-[#770FBD]">
          ID: {id}
        </h3>
        
        <div className="relative" ref={paymentDropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
            }}
            className={`flex items-center justify-between gap-1.5 w-[106px] h-[26px] rounded-[13px] border border-[#257447] px-3 pr-3 py-1 font-[var(--font-lato),sans-serif] font-normal text-xs leading-[131%] tracking-[0%] ${
              currentPaymentStatus === 'pagado'
                ? 'bg-[#ECF9F1] text-[#319B5F] border-[#257447]'
                : 'bg-[#FDF5E7] text-[#BD7D0F] border-[#FCD34D]'
            }`}
          >
            {currentPaymentStatus === 'pagado' ? (
              <>
                  <div className="flex items-center gap-2">
                    <Image src="/checkPedidos.png" alt="Check" width={12} height={12} className="w-3 h-3 object-contain" />
                    <span className="font-[var(--font-lato),sans-serif] font-normal text-[12px] leading-[131%] text-[#319B5F]">
                      Pagado
                    </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Image src="/deposito.png" alt="Depósito" width={12} height={12} className="w-3 h-3 object-contain" />
                  <span className="font-[var(--font-lato),sans-serif] font-normal text-[12px] leading-[131%] text-[#BD7D0F]">
                    Depósito
                  </span>
                </div>
              </>
            )}
            <Image
              src={currentPaymentStatus === 'pagado' ? '/dropdown.png' : '/depositoDropdown.png'}
              alt="Abrir"
              width={currentPaymentStatus === 'pagado' ? 22 : 12}
              height={currentPaymentStatus === 'pagado' ? 16 : 8}
              className={`object-contain ${
                currentPaymentStatus === 'pagado'
                  ? 'w-[22px] h-[16px] [filter:brightness(0)_saturate(100%)_invert(31%)_sepia(90%)_saturate(428%)_hue-rotate(97deg)_brightness(93%)_contrast(91%)]'
                  : 'w-[12px] h-[8px] ml-3 [filter:brightness(0)_saturate(100%)_invert(47%)_sepia(69%)_saturate(793%)_hue-rotate(10deg)_brightness(91%)_contrast(97%)]'
              }`}
            />
          </button>
          
          {isPaymentDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[106px] rounded-[12px] shadow-lg border border-[#257447] z-50 overflow-hidden bg-white">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPaymentStatus('pagado');
                  setIsPaymentDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 h-[34px] rounded-t-[12px] px-3 py-2 font-[var(--font-lato),sans-serif] font-normal text-[12px] leading-[131%] tracking-[0%] bg-[#ECF9F1] text-[#319B5F] hover:bg-[#D1F2E0]"
              >
                <Image src="/checkPedidos.png" alt="Check" width={12} height={12} className="w-3 h-3 object-contain" />
                <span className="font-[var(--font-lato),sans-serif] font-normal text-[12px] leading-[131%] text-[#319B5F]">
                  Pagado
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPaymentStatus('deposito');
                  setIsPaymentDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 h-[34px] rounded-b-[12px] px-3 py-2 font-[var(--font-lato),sans-serif] font-normal text-xs leading-[131%] tracking-[0%] bg-[#FDF5E7] text-[#BD7D0F] hover:bg-[#FEF3C7]"
              >
                <Image src="/deposito.png" alt="Depósito" width={12} height={12} className="w-3 h-3 object-contain" />
                <span className="font-[var(--font-lato),sans-serif] font-normal text-[12px] leading-[131%] text-[#BD7D0F]">
                  Depósito
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 sm:mb-5 font-lato leading-[131%] tracking-normal text-[13px] text-[#171717]">
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Nombre:</span> 
          <span className="wrap-break-word font-normal">{name}</span>
        </p>
        <p className="flex flex-wrap items-baseline">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Encargo:</span> 
          <span className="font-normal">{orderDate}</span>
          <span className="mx-1 sm:mx-2 text-gray-300">|</span>
          <span className="font-bold text-[#171717] ml-auto mr-1 sm:mr-1.5">Entrega:</span> 
          <span className="ml-1 font-normal">{deliveryDate}</span>
        </p>
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Precio total:</span> 
          <span className="font-normal">
             {price > 0 ? price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '00000000$'}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!showMessageInput ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTelegramClick();
              }}
              disabled={!telegramChatId}
              className={`rounded-xl flex items-center whitespace-nowrap py-0.5 px-1.5 gap-1.5 font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black bg-[#E3F2FD] border border-[#BBDEFB] transition-colors ${
                telegramChatId ? 'hover:bg-[#BBDEFB] cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
              title={!telegramChatId ? 'ChatId de Telegram no disponible' : 'Enviar mensaje por Telegram'}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 shrink-0"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 14.95 9.7 15.02 9.37C15.03 9.3 15.03 9.13 14.93 9.05C14.84 8.97 14.7 9 14.58 9.02C14.41 9.05 12.15 10.3 8.78 12.23C8.18 12.57 7.63 12.73 7.13 12.72C6.58 12.7 5.52 12.4 4.7 12.14C3.75 11.83 3.01 11.66 3.07 11.12C3.1 10.85 3.41 10.58 3.9 10.33C6.31 9.19 8.13 8.4 9.36 7.97C11.83 7.2 12.5 7.01 12.94 7C13.01 7 13.15 7.01 13.25 7.09C13.33 7.16 13.36 7.26 13.37 7.33C13.38 7.4 13.39 7.53 13.38 7.63C13.36 8.08 13.2 9.38 13.06 10.78C12.85 12.78 12.66 14.58 12.61 14.95C12.54 15.5 12.35 15.68 12.17 15.71C11.72 15.78 11.38 15.44 10.95 15.05L16.64 8.8Z"
                  fill="#0088cc"
                />
              </svg>
              Telegram
            </button>
            
            <div className="relative ml-auto" ref={operativoDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOperativoDropdownOpen(!isOperativoDropdownOpen);
                }}
                className="flex items-center whitespace-nowrap bg-[#8B68FD] text-[#FEFCFF] font-lato font-normal text-[12px] leading-[131%] tracking-normal rounded-xl h-[26px] px-3 gap-2 w-[140px]"
              >
                {currentOperativoStatus === 'presupuesto' && (
                  <>
                    <Image
                      src="/iconoPresupuesto.png"
                      alt="Presupuesto"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain shrink-0 [filter:brightness(0)_invert(1)]"
                    />
                    <span className="text-[12px] leading-[131%] text-[#FEFCFF]">Presupuesto</span>
                  </>
                )}
                {currentOperativoStatus === 'en compra' && (
                  <>
                    <Image
                      src="/iconoCompra.png"
                      alt="En compra"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain shrink-0 [filter:brightness(0)_invert(1)]"
                    />
                    En compra
                  </>
                )}
                {currentOperativoStatus === 'en produccion' && (
                  <>
                    <Image
                      src="/iconoProduccion.png"
                      alt="En producción"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain shrink-0 [filter:brightness(0)_invert(1)]"
                    />
                    En producción
                  </>
                )}
                {currentOperativoStatus === 'entregado' && (
                  <>
                    <Image
                      src="/iconoEntregado.png"
                      alt="Entregado"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain shrink-0 [filter:brightness(0)_invert(1)]"
                    />
                    <span className="text-[12px] leading-[131%] text-[#FEFCFF]">Entregado</span>
                  </>
                )}
                <ChevronDown size={12} className="w-3 h-3 text-[#FEFCFF]" />
              </button>
              
              {isOperativoDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-[140px] bg-[#D8CDFE] rounded-[12px] shadow-md border border-[#B59DF9] z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentOperativoStatus('presupuesto');
                      setIsOperativoDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] rounded-t-[12px] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9]"
                  >
                    <Image
                      src="/iconoPresupuesto.png"
                      alt="Presupuesto"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain [filter:brightness(0)_saturate(100%)_invert(33%)_sepia(15%)_saturate(458%)_hue-rotate(252deg)_brightness(95%)_contrast(86%)]"
                    />
                    <span className="text-[11px] font-lato leading-[131%]">Presupuesto</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentOperativoStatus('en compra');
                      setIsOperativoDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9]"
                  >
                    <Image
                      src="/iconoCompra.png"
                      alt="En compra"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain [filter:brightness(0)_saturate(100%)_invert(33%)_sepia(15%)_saturate(458%)_hue-rotate(252deg)_brightness(95%)_contrast(86%)]"
                    />
                    <span className="text-[11px] font-lato leading-[131%]">En compra</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentOperativoStatus('en produccion');
                      setIsOperativoDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] font-lato text-[11px] leading-[131%] border-b border-[#B59DF9]"
                  >
                    <Image
                      src="/iconoProduccion.png"
                      alt="En producción"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain [filter:brightness(0)_saturate(100%)_invert(33%)_sepia(15%)_saturate(458%)_hue-rotate(252deg)_brightness(95%)_contrast(86%)]"
                    />
                    <span className="text-[11px] font-lato leading-[131%]">En producción</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentOperativoStatus('entregado');
                      setIsOperativoDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 h-[30px] px-3 text-left bg-[#D8CDFE] hover:bg-[#CFC4FD] text-[#6A5379] rounded-b-[12px] font-lato text-[11px] leading-[131%]"
                  >
                    <Image
                      src="/iconoEntregado.png"
                      alt="Entregado"
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain [filter:brightness(0)_saturate(100%)_invert(33%)_sepia(15%)_saturate(458%)_hue-rotate(252deg)_brightness(95%)_contrast(86%)]"
                    />
                    <span className="text-[11px] font-lato leading-[131%]">Entregado</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className="w-full bg-white rounded-xl border border-[#BBDEFB] p-3 sm:p-4 space-y-2 sm:space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Enviar mensaje por Telegram</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                disabled={isSending}
                aria-label="Cerrar"
              >
                <X size={16} className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088cc] focus:border-transparent resize-none"
              rows={3}
              disabled={isSending}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="w-full sm:w-auto px-4 py-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={isSending}
              >
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendTelegramMessage();
                }}
                disabled={isSending || !message.trim()}
                className="w-full sm:w-auto px-4 py-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-1"
              >
                {isSending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={12} className="w-3 h-3" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}