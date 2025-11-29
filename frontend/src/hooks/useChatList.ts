import { useState, useMemo, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ChatItemProps } from '@/components/inbox/ChatItem';
import { apiClient } from '@/config/apiClient';
import { getSocket } from '@/services/socket.service';

export type FilterType = 'todos' | 'no-leidos' | 'leidos';

interface TelegramChatResponse {
  chatId: string;
  name: string;
  lastMessage: string;
  lastMessageSource: string;
  timestamp: Date | string;
  hasBudget: boolean;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TelegramChatResponse[];
}

interface TelegramMessageData {
  chatId: number | string;
  firstName?: string;
  lastName?: string;
  username?: string;
  text?: string;
  source?: string;
  timestamp?: string;
}

export function useChatList() {
  const [chats, setChats] = useState<ChatItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const socketRef = useRef<Socket | null>(null);
  const chatsMapRef = useRef<Map<string, ChatItemProps>>(new Map());

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient<ApiResponse>('/telegram/chats');
        
        // El endpoint devuelve { success, statusCode, message, data }
        const chatsData = response.data || [];
        
        const chatsList: ChatItemProps[] = chatsData.map((chat) => {
          // Agregar prefijo "Tu: " si el mensaje fue enviado desde konfex
          const message = chat.lastMessageSource === 'konfex' 
            ? `Tu:  ${chat.lastMessage || ''}`
            : chat.lastMessage || '';
          
          const chatItem: ChatItemProps = {
            id: Number(chat.chatId) || 0,
            avatar: '/imagenChat.png',
            name: chat.name || `Chat ${chat.chatId}`,
            message,
            time: chat.timestamp
              ? new Date(chat.timestamp).toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : new Date().toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
            hasBudget: chat.hasBudget || false,
          };
          
          return chatItem;
        });
        
        // Inicializar el mapa de chats
        chatsMapRef.current.clear();
        chatsList.forEach(chat => {
          chatsMapRef.current.set(String(chat.id), chat);
        });
        
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

  // Función para crear un ChatItem desde datos de mensaje
  const createChatItemFromMessage = (messageData: TelegramMessageData, existingChat?: ChatItemProps): ChatItemProps => {
    const chatId = String(messageData.chatId);
    const name = messageData.firstName && messageData.lastName
      ? `${messageData.firstName} ${messageData.lastName}`.trim()
      : messageData.firstName || messageData.lastName || existingChat?.name || `Chat ${chatId}`;
    
    const message = messageData.source === 'konfex'
      ? `Tu:  ${messageData.text || ''}`
      : messageData.text || '';
    
    const time = messageData.timestamp
      ? new Date(messageData.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    return {
      id: Number(chatId) || 0,
      avatar: '/imagenChat.png',
      name,
      message,
      time,
      hasBudget: existingChat?.hasBudget || false,
    };
  };

  // Función para actualizar o agregar un chat desde un mensaje
    // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateChatFromMessage = (messageData: TelegramMessageData) => {
    const chatId = String(messageData.chatId);
    const existingChat = chatsMapRef.current.get(chatId);
    const chatItem = createChatItemFromMessage(messageData, existingChat);

    // Actualizar el mapa de chats
    chatsMapRef.current.set(chatId, chatItem);
    
    // Convertir el mapa a array y ordenar por timestamp (más recientes primero)
    const allChats = Array.from(chatsMapRef.current.values());
    
    // Mover el chat actualizado al principio
    const updatedChatIndex = allChats.findIndex(chat => String(chat.id) === chatId);
    if (updatedChatIndex > 0) {
      const [updatedChat] = allChats.splice(updatedChatIndex, 1);
      allChats.unshift(updatedChat);
    } else if (updatedChatIndex === -1) {
      // Si no existe, agregarlo al principio
      allChats.unshift(chatItem);
    }
    
    setChats(allChats);
  };

  // Configurar Socket.IO para actualizaciones en tiempo real
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    const handleTelegramMessage = (messageData: TelegramMessageData) => {
      if (messageData && messageData.chatId) {
        console.log('📩 Nuevo mensaje recibido via Socket.IO para lista de chats:', messageData);
        updateChatFromMessage(messageData);
      }
    };

    const setupListeners = () => {
      if (!socket.io.opts.autoConnect) {
        console.warn('⚠️ Socket deshabilitado (no auto-connect). Socket.IO no disponible.');
        return;
      }

      if (!socket.connected) {
        console.log('⏳ Socket no conectado aún, esperando conexión...');
        
        const onConnect = () => {
          console.log('✅ Socket conectado, configurando listeners de chats...');
          setupListeners();
        };
        
        socket.once('connect', onConnect);
        return;
      }

      console.log('🔌 Socket conectado, escuchando mensajes de Telegram para lista de chats...');
      
      // Escuchar múltiples variantes del evento de mensaje
      socket.on('telegram_message', handleTelegramMessage);
      socket.on('telegram:message', handleTelegramMessage);
      socket.on('telegram:new_message', handleTelegramMessage);
      socket.on('message:telegram', handleTelegramMessage);
      
      console.log('✅ Listeners de Socket.IO registrados para actualizaciones de chats');
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
      }
    }

    // Cleanup: remover listeners cuando el componente se desmonte
    return () => {
      if (socket) {
        socket.off('telegram_message', handleTelegramMessage);
        socket.off('telegram:message', handleTelegramMessage);
        socket.off('telegram:new_message', handleTelegramMessage);
        socket.off('message:telegram', handleTelegramMessage);
      }
    };
  }, [updateChatFromMessage]);

  const filteredChats = useMemo(() => {
    let filtered = chats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((chat) =>
        chat.name.toLowerCase().includes(query)
      );
    }

    if (activeFilter === 'no-leidos') {
      filtered = filtered.filter((chat) => !chat.hasBudget);
    } else if (activeFilter === 'leidos') {
      filtered = filtered.filter((chat) => chat.hasBudget);
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

