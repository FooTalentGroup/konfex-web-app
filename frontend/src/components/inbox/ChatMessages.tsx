'use client';

import React, { useRef } from 'react';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/hooks/useChat';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface ChatMessagesProps {
  messages: ChatMessageType[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useAutoScroll(messages);

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
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {/* Elemento invisible al final para hacer scroll */}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

