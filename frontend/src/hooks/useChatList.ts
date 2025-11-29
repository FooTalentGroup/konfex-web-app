import { useState, useMemo, useEffect } from 'react';
import { ChatItemProps } from '@/components/inbox/ChatItem';
import { apiClient } from '@/config/apiClient';

export type FilterType = 'todos' | 'no-leidos' | 'leidos';

export interface PlataformaConfig {
  bg: string;
  borderColor?: string;
  iconType: 'telegram';
}

export function getPlataformaConfig(plataforma: 'telegram'): PlataformaConfig {
  return {
    bg: '#E3F2FD',
    borderColor: '#BBDEFB',
    iconType: plataforma,
  };
}

interface TelegramChatResponse {
  chatId: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  lastMessage: string;
  timestamp: Date | string;
  hasBudget: boolean;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TelegramChatResponse[];
}

export function useChatList() {
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient<ApiResponse>('/telegram/chats');
        
        // El endpoint devuelve { success, statusCode, message, data }
        const chatsData = response.data || [];
        
        const chatsList: ChatItemProps[] = chatsData.map((chat) => ({
          id: Number(chat.chatId) || 0,
          avatar: '/imagenChat.png',
          nombre: chat.firstName 
            ? `${chat.firstName}${chat.lastName ? ` ${chat.lastName}` : ''}`
            : `Chat ${chat.chatId}`,
          mensaje: chat.lastMessage || '',
          hora: chat.timestamp
            ? new Date(chat.timestamp).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
          plataforma: 'telegram',
          tienePresupuesto: chat.hasBudget || false,
        }));
        
        setChats(chatsList);
      } catch (error) {
        console.error('Error al obtener los chats:', error);
        // En caso de error, mantener el array vacío
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = useMemo(() => {
    let filtered = chats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chat) =>
        chat.nombre.toLowerCase().includes(query)
      );
    }

    if (activeFilter === 'no-leidos') {
      filtered = filtered.filter((chat) => !chat.tienePresupuesto);
    } else if (activeFilter === 'leidos') {
      filtered = filtered.filter((chat) => chat.tienePresupuesto);
    }

    return filtered;
  }, [chats, searchQuery, activeFilter]);

  return {
    filteredChats,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  };
}

