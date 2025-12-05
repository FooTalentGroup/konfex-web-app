'use client';

import React, {FC} from 'react';
import Image from 'next/image';

export interface ChatItemProps {
  id: number;
  avatar?: string;
  name: string;
  message: string;
  time: string;
  hasBudget?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

const ChatItem: FC<ChatItemProps> = ({
  avatar,
  name,
  message,
  time,
  hasBudget = false,
  unreadCount = 0,
  onClick,
}) => {

  const renderPlatformIcon = () => {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 14.95 9.7 15.02 9.37C15.03 9.3 15.03 9.13 14.93 9.05C14.84 8.97 14.7 9 14.58 9.02C14.41 9.05 12.15 10.3 8.78 12.23C8.18 12.57 7.63 12.73 7.13 12.72C6.58 12.7 5.52 12.4 4.7 12.14C3.75 11.83 3.01 11.66 3.07 11.12C3.1 10.85 3.41 10.58 3.9 10.33C6.31 9.19 8.13 8.4 9.36 7.97C11.83 7.2 12.5 7.01 12.94 7C13.01 7 13.15 7.01 13.25 7.09C13.33 7.16 13.36 7.26 13.37 7.33C13.38 7.4 13.39 7.53 13.38 7.63C13.36 8.08 13.2 9.38 13.06 10.78C12.85 12.78 12.66 14.58 12.61 14.95C12.54 15.5 12.35 15.68 12.17 15.71C11.72 15.78 11.38 15.44 10.95 15.05L16.64 8.8Z"
          fill="#0088cc"
        />
      </svg>
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg transition-all text-left mb-2 bg-[#FEFCFF] border border-transparent shadow-[0px_4px_8px_0px_rgba(0,0,0,0.06)] hover:bg-[#F3F0F5] hover:border-[#D5A1F7] hover:shadow-none"
    >
      <div className="flex-shrink-0">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-lato text-sm sm:text-base font-bold leading-[131%] tracking-normal text-black truncate">
              {name}
            </span>
            {unreadCount > 0 && (
              <span className="flex-shrink-0 bg-[#B65CF2] text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-2 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Image
              src="/reloj.png"
              alt="Reloj"
              width={14}
              height={14}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain"
            />
            <span className="font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black whitespace-nowrap">
              {time}
            </span>
          </div>
        </div>

        <p className="mb-2 truncate font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black">
          {message}
        </p>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="rounded-xl flex items-center py-0.5 px-1.5 gap-1 sm:gap-1.5 font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black whitespace-nowrap border border-[#BBDEFB] bg-[#E3F2FD]">
            {renderPlatformIcon()}
            Telegram
          </span>

          {hasBudget && (
            <span className="flex items-center bg-[#F7D8A1] rounded-xl py-0.5 px-1.5 gap-1 sm:gap-1.5 font-lato text-xs sm:text-sm font-normal leading-[131%] tracking-normal text-black whitespace-nowrap">
              <Image
                src="/presupuestos.png"
                alt="Presupuesto"
                width={12}
                height={12}
                className="w-3 h-3 sm:w-3 sm:h-3 object-contain"
              />
              Presupuesto
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ChatItem;

