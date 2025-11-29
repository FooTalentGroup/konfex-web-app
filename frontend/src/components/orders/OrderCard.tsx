'use client';

import React from 'react';
import { Wallet, Send, X } from 'lucide-react';
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
  telegramChatId?: string; // ChatId de Telegram para enviar mensajes
}

export default function OrderCard({
  id,
  name,
  orderDate,
  deliveryDate,
  garmentType,
  price,
  status,
  telegramChatId,
}: OrderCardProps) {
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
  return (
    <div 
      className="bg-[#FBF4FF] rounded-2xl shadow-sm border border-[#AA42F0] w-full relative p-4 sm:p-6 md:p-[30px] mt-0 mb-2"
    >
      
      {/* Header: ID y Estado */}
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h3 className="font-lato font-bold not-italic text-sm sm:text-base leading-[131%] tracking-normal text-[#770FBD]">
          ID: {id}
        </h3>
        
        {/* Badges de Estado idénticos a Figma */}
        {status === 'pagado' ? (
          <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs border font-lato font-normal leading-[131%] tracking-normal bg-[#ECF9F1] text-[#319B5F] border-[#257447]">
            Pagado <Image src="/check.png" alt="Check" width={12} height={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain" />
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border border-amber-200">
            Depósito <Wallet size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Datos del pedido con tipografía Lato */}
      <div className="space-y-2 mb-4 sm:mb-5 font-lato leading-[131%] tracking-normal text-[13px] text-[#171717]">
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Nombre:</span> 
          <span className="wrap-break-word font-normal">{name}</span>
        </p>
        <p className="flex flex-wrap items-baseline">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Encargo:</span> 
          <span className="font-normal">{orderDate}</span>
          <span className="mx-1 sm:mx-2 text-gray-300">|</span>
          <span className="font-bold text-[#171717]">Entrega:</span> 
          <span className="ml-1 font-normal">{deliveryDate}</span>
        </p>
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Tipo de prenda:</span> 
          <span className="wrap-break-word font-normal">{garmentType}</span>
        </p>
        <p className="flex items-baseline flex-wrap">
          <span className="font-bold w-24 sm:w-28 ml-2 sm:ml-3 text-[#171717]">Precio:</span> 
          <span className="font-normal">
             {price > 0 ? price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '00000000$'}
          </span>
        </p>
      </div>

      {/* Tags de Plataforma y Presupuesto */}
      <div className="flex items-center gap-2 flex-wrap">
        {!showMessageInput ? (
          <>
            <button
              onClick={handleTelegramClick}
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
            
            <span className="flex items-center whitespace-nowrap bg-[#8B68FD] text-[#FEFCFF] font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal rounded-xl py-0.5 px-1.5 gap-1.5">
              <Image
                src="/pedido.png"
                alt="Presupuesto"
                width={12}
                height={12}
                className="w-3 h-3 object-contain shrink-0"
              />
              Presupuesto
            </span>
          </>
        ) : (
          <div className="w-full bg-white rounded-xl border border-[#BBDEFB] p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Enviar mensaje por Telegram</span>
              <button
                onClick={handleCancel}
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
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={isSending}
              >
                Cancelar
              </button>
              <button
                onClick={sendTelegramMessage}
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