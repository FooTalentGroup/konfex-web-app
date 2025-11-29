import { useState, useMemo, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ChatItemProps } from '@/components/inbox/ChatItem';
import { getSocket } from '@/services/socket.service';

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

interface TelegramChatData {
  chatId: number | string;
  firstName?: string;
  lastName?: string;
  username?: string;
  text?: string;
  timestamp?: string;
}

export function useChatList() {
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const socketRef = useRef<Socket | null>(null);
  const chatsMapRef = useRef<Map<string | number, ChatItemProps>>(new Map());

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    const updateChatFromMessage = (messageData: TelegramChatData) => {
      const chatId = String(messageData.chatId);
      const nombre = messageData.firstName 
        ? `${messageData.firstName}${messageData.lastName ? ` ${messageData.lastName}` : ''}`
        : `Chat ${chatId}`;
      
      const hora = messageData.timestamp 
        ? new Date(messageData.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      const chatItem: ChatItemProps = {
        id: Number(chatId) || 0,
        avatar: '/imagenChat.png',
        nombre,
        mensaje: messageData.text || '',
        hora,
        plataforma: 'telegram',
        tienePresupuesto: false,
      };

      chatsMapRef.current.set(chatId, chatItem);
      
      setChats(Array.from(chatsMapRef.current.values()));
    };

    const handleTelegramMessage = (messageData: any) => {
      if (messageData && messageData.chatId) {
        updateChatFromMessage(messageData);
      }
    };

    const fetchChats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const apiBase = apiUrl.replace(/\/api\/v1$/, '');
        
        const response = await fetch(`${apiBase}/api/v1/telegram/chats`).catch(() => null);
        
        if (response && response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const chatsList: ChatItemProps[] = data.map((chat: any) => ({
              id: Number(chat.chatId) || 0,
              avatar: '/imagenChat.png',
              nombre: chat.firstName 
                ? `${chat.firstName}${chat.lastName ? ` ${chat.lastName}` : ''}`
                : `Chat ${chat.chatId}`,
              mensaje: chat.lastMessage || chat.text || '',
              hora: chat.lastTimestamp || chat.timestamp
                ? new Date(chat.lastTimestamp || chat.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              plataforma: 'telegram',
              tienePresupuesto: chat.hasBudget || false,
            }));
            
            chatsMapRef.current.clear();
            chatsList.forEach(chat => {
              chatsMapRef.current.set(String(chat.id), chat);
            });
            setChats(chatsList);
          }
        }
      } catch (error) {
        console.warn('⚠️ No se pudieron obtener los chats del backend. Los chats se actualizarán cuando lleguen mensajes.');
      } finally {
        setIsLoading(false);
      }
    };

    const setupListeners = () => {
      if (!socket.io.opts.autoConnect) {
        console.warn('⚠️ Socket deshabilitado (no auto-connect). Socket.IO no disponible.');
        setIsLoading(false);
        return;
      }

      if (!socket.connected) {
        const onConnect = () => {
          console.log('✅ Socket conectado, configurando listeners de chats...');
          setupListeners();
        };
        
        socket.once('connect', onConnect);
        return;
      }

      socket.on('telegram_message', handleTelegramMessage);
      socket.on('telegram:message', handleTelegramMessage);
      socket.on('telegram:new_message', handleTelegramMessage);
      socket.on('message:telegram', handleTelegramMessage);
      
      fetchChats();
    };

    if (socket.connected) {
      setupListeners();
    } else {
      socket.once('connect', setupListeners);
      
      try {
        if (!socket.connected) {
          socket.connect();
        }
      } catch (error) {
        console.warn('⚠️ No se pudo conectar el socket:', error);
        setIsLoading(false);
      }
    }

    return () => {
      if (socket) {
        socket.off('telegram_message', handleTelegramMessage);
        socket.off('telegram:message', handleTelegramMessage);
        socket.off('telegram:new_message', handleTelegramMessage);
        socket.off('message:telegram', handleTelegramMessage);
      }
    };
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

