'use client';

import React from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Paperclip } from 'lucide-react';
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
        <div className="shrink-0">
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
            : 'items-start max-w-[75%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[55%] 2xl:max-w-[50%]'
        }`}
      >
        <div
          className={`px-2 py-1.5 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 w-full min-w-fit rounded-t-[25px] rounded-bl-[25px] rounded-br-[25px] ${
            message.isSent ? 'bg-[#8B709D] text-white' : 'bg-[#E6E1EA] text-black'
          }`}
        >
          {message.type === 'photo' && message.fileUrl && (
            <div className="block mb-2">
              <Zoom zoomMargin={24}>
                <Image
                  src={message.fileUrl}
                  alt="Foto"
                  width={840}
                  height={840}
                  className="rounded-xl max-h-[260px] max-w-full w-auto h-auto object-contain cursor-zoom-in"
                  unoptimized={false}
                />
              </Zoom>
            </div>
          )}

          {message.type === 'document' && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 mb-1 w-full bg-white/70 text-[#4B5563] rounded-lg px-2 py-1 border border-[#C8B6D8]"
            >
              <Paperclip size={14} className="text-[#8B709D]" />
              <span className="text-xs sm:text-sm font-lato font-normal leading-[131%] break-all">
                {message.filePath?.split('/').pop() || 'Archivo'}
              </span>
            </a>
          )}

          {message.text && (
            <p className="text-xs sm:text-sm font-lato font-normal leading-[131%] tracking-normal wrap-break-word whitespace-normal block w-full">
              {message.text}
            </p>
          )}
        </div>
        <span className="mt-0.5 sm:mt-1 px-1 text-[10px] sm:text-xs font-lato font-normal leading-[131%] tracking-normal text-[#666666]">
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;


