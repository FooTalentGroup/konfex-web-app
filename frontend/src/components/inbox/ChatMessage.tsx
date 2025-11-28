'use client';

import React from 'react';
import Image from 'next/image';
import { ChatMessage as ChatMessageType } from '@/hooks/useChat';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3 ${
        message.isSent ? 'justify-end' : 'justify-start'
      }`}
    >
      {!message.isSent && (
        <div className="flex-shrink-0">
          <Image
            src={message.senderAvatar || "/perfil.png"}
            alt="Sender"
            width={32}
            height={32}
            className="rounded-full object-cover w-7 h-7 sm:w-8 sm:h-8 border border-[#8B709D]"
          />
        </div>
      )}

      <div
        className={`flex flex-col ${
          message.isSent 
            ? 'items-end ml-auto max-w-[75%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[55%] 2xl:max-w-[50%]' 
            : 'items-start max-w-[250px] sm:max-w-[220px] md:max-w-[200px]'
        }`}
      >
        <div
          className={`px-2 py-1.5 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 w-full min-w-fit rounded-t-[25px] rounded-bl-[25px] rounded-br-[25px] ${
            message.isSent ? 'bg-[#8B709D] text-white' : 'bg-[#E6E1EA] text-black'
          }`}
        >
          <p className="text-xs sm:text-sm font-lato font-normal leading-[131%] tracking-normal wrap-break-word whitespace-normal block w-full">
            {message.text}
          </p>
        </div>
        <span className="mt-0.5 sm:mt-1 px-1 text-[10px] sm:text-xs font-lato font-normal leading-[131%] tracking-normal text-[#666666]">
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;


