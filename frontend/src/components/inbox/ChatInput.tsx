'use client';

import React from 'react';
import Image from 'next/image';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
}) => {
  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 pt-2 pb-1 sm:py-2.5 md:py-3 flex items-center gap-1.5 bg-[#F3F0F5] border-t border-[#E5E5E5]">
      <button
        onClick={() => {}}
        className="flex-shrink-0 w-12 h-12 rounded-[32px] p-2 flex items-center justify-center transition-colors hover:opacity-90 bg-[#E6E1EA] shadow-[0px_0px_4px_0px_rgba(61,52,68,0.25)]"
      >
        <Image
          src="/Chatimg.png"
          alt="Menú"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </button>

      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Placeholder"
          className="w-full h-12 px-3 rounded-md border border-[#B65CF2] focus:outline-none text-xs sm:text-sm md:text-base font-lato font-normal leading-[131%] tracking-normal text-black bg-[#FEFCFF] shadow-[0px_3px_5.99px_-3px_rgba(0,0,0,0.08),0px_0px_8.99px_0px_rgba(0,0,0,0.10)]"
        />
        <button
          onClick={() => {}}
          className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
              stroke="#9D86AC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 9C7 9.55228 7.44772 10 8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9Z"
              fill="#9D86AC"
            />
            <path
              d="M11 9C11 9.55228 11.4477 10 12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9Z"
              fill="#9D86AC"
            />
            <path
              d="M7 13C7 13 8 14 10 14C12 14 13 13 13 13"
              stroke="#9D86AC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <button
        onClick={onSend}
        className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-90 bg-[#AA42F0]"
      >
        <Image
          src="/fechaEnvio.png"
          alt="Enviar mensaje"
          width={20}
          height={20}
          className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
        />
      </button>
    </div>
  );
};

export default ChatInput;

