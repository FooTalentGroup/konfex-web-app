'use client';

import React, { useRef, useMemo } from 'react';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/hooks/useChat';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface ChatMessagesProps {
  messages: ChatMessageType[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useAutoScroll(messages);

  // Agrupar mensajes por día y agregar separadores
  const messagesWithSeparators = useMemo(() => {
    if (messages.length === 0) return [];

    const grouped: Array<ChatMessageType | { type: 'separator'; date: string }> = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = message.date || '';
      
      // Si cambió el día, agregar separador
      if (messageDate && messageDate !== currentDate) {
        currentDate = messageDate;
        grouped.push({
          type: 'separator',
          date: messageDate,
        } as { type: 'separator'; date: string });
      }
      
      grouped.push(message);
    });

    return grouped;
  }, [messages]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 lg:px-6 pt-6 sm:pt-8 md:pt-8 lg:pt-10 xl:pt-12 pb-2 sm:pb-3 md:pb-4 lg:pb-6 bg-[#F3F0F5]"
    >
      {messages.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base font-lato text-[13px]">
            No hay mensajes aún
          </p>
        </div>
      ) : (
        <div>
          {messagesWithSeparators.map((item, index) => {
            if ('type' in item && item.type === 'separator') {
              return (
                <div
                  key={`separator-${item.date}-${index}`}
                  className="flex items-center justify-center my-4 sm:my-6"
                >
                  <div className="flex items-center w-full">
                    <div className="flex-1 h-px bg-[#D5A1F7]"></div>
                    <span className="px-3 sm:px-4 text-xs sm:text-sm font-lato font-medium text-[#8B709D] whitespace-nowrap">
                      {item.date}
                    </span>
                    <div className="flex-1 h-px bg-[#D5A1F7]"></div>
                  </div>
                </div>
              );
            }
            return (
              <ChatMessage key={(item as ChatMessageType).id} message={item as ChatMessageType} />
            );
          })}
          {/* Elemento invisible al final para hacer scroll */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

