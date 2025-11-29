'use client';

import React, {FC} from 'react';
import ChatItem, { ChatItemProps } from './ChatItem';

interface ChatListProps {
  chats: ChatItemProps[];
  onChatClick?: (chatId: number) => void;
}

const ChatList: FC<ChatListProps> = ({ chats, onChatClick }) => {
  return (
    <div className="w-full">
      {chats.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-lato text-sm">
            No hay chats disponibles
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              {...chat}
              onClick={() => onChatClick?.(chat.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;

