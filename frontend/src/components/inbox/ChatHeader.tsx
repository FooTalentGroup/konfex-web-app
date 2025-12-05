"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatContact } from "@/hooks/useChat";
import { useSocketStatus } from "@/hooks/useSocketStatus";

interface ChatHeaderProps {
  contact: ChatContact | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  const router = useRouter();
  const isConnected = useSocketStatus();

  if (!contact) {
    return null;
  }

  return (
    <div className="w-full px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4 bg-[#FEFCFF] rounded-b-2xl shadow-[0px_3px_5.99px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-3">
        <button
          onClick={() => router.back()}
          className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-90 bg-[#9D86AC]"
        >
          <Image
            src="/flechaTela.png"
            alt="Volver"
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
          />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <span className="rounded-xl flex items-center whitespace-nowrap py-0.5 px-1 sm:px-1.5 gap-1 sm:gap-1.5 font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black bg-[#E3F2FD] border border-[#BBDEFB]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 sm:w-3 sm:h-3 shrink-0"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 14.95 9.7 15.02 9.37C15.03 9.3 15.03 9.13 14.93 9.05C14.84 8.97 14.7 9 14.58 9.02C14.41 9.05 12.15 10.3 8.78 12.23C8.18 12.57 7.63 12.73 7.13 12.72C6.58 12.7 5.52 12.4 4.7 12.14C3.75 11.83 3.01 11.66 3.07 11.12C3.1 10.85 3.41 10.58 3.9 10.33C6.31 9.19 8.13 8.4 9.36 7.97C11.83 7.2 12.5 7.01 12.94 7C13.01 7 13.15 7.01 13.25 7.09C13.33 7.16 13.36 7.26 13.37 7.33C13.38 7.4 13.39 7.53 13.38 7.63C13.36 8.08 13.2 9.38 13.06 10.78C12.85 12.78 12.66 14.58 12.61 14.95C12.54 15.5 12.35 15.68 12.17 15.71C11.72 15.78 11.38 15.44 10.95 15.05L16.64 8.8Z"
                fill="#0088cc"
              />
            </svg>
            Telegram
          </span>

          <span className="flex items-center whitespace-nowrap bg-[#F7D8A1] text-black font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal rounded-xl py-0.5 px-1 sm:px-1.5 gap-1 sm:gap-1.5">
            <Image
              src="/presupuestos.png"
              alt="Presupuesto"
              width={12}
              height={12}
              className="object-contain"
            />
            Presupuesto
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end mb-1.5 sm:mb-2">
        <span className="font-lato text-sm sm:text-base font-bold leading-[131%] tracking-normal text-[#35293D] text-right mr-2 sm:mr-4 truncate max-w-[60%] sm:max-w-none">
          {contact.nombre}
        </span>
        <div className="relative shrink-0">
          <Image
            src="/perfil.png"
            alt={contact.nombre}
            width={32}
            height={32}
            className="rounded-full object-cover shrink-0 w-7 h-7 sm:w-8 sm:h-8 border border-[#8B709D]"
          />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={
              isConnected ? "Conectado al backend" : "Desconectado del backend"
            }
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 sm:gap-4">
        <button
          onClick={() => {}}
          className="hover:opacity-80 transition-opacity font-lato text-sm font-bold leading-[131%] tracking-normal text-[#770FBD] underline flex items-center gap-2 sm:gap-3"
        >
          Ficha de cliente →
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
