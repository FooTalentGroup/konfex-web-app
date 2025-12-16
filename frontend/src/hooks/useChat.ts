import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/services/socket.service';
import { apiClient } from '@/config/apiClient';

export interface ChatMessage {
  id: number;
  text?: string | null;
  time: string;
  date?: string;
  isSent: boolean;
  senderAvatar?: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  type?: 'text' | 'photo' | 'document';
  fileUrl?: string | null;
  mimeType?: string | null;
  filePath?: string | null;
  fileSize?: number | null;
}

export interface ChatContact {
  id: number;
  chatId: string;
  name: string;
  avatar?: string;
  platform: 'telegram';
  hasBudget?: boolean;
  clientId?: string;
}

export interface TelegramMessage {
  chatId: string | number;
  text?: string | null;
  source: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  timestamp: string;
  type?: 'text' | 'photo' | 'document';
  fileUrl?: string | null;
  filePath?: string | null;
  fileId?: string | null;
  fileUniqueId?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
}

export const useChat = (chatId: string) => {
  const [contact, setContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient<{
          success: boolean;
          statusCode: number;
          message: string;
          data: Array<{
            id: number;
            chatId: string;
            text?: string | null;
            source: string;
            firstName?: string | null;
            lastName?: string | null;
            username?: string | null;
            timestamp: string;
            type?: 'text' | 'photo' | 'document';
            fileUrl?: string | null;
            filePath?: string | null;
            fileId?: string | null;
            fileUniqueId?: string | null;
            mimeType?: string | null;
            fileSize?: number | null;
          }>;
        }>(`/telegram/chats/${chatId}/messages`);

        const messagesData = response.data || [];
        
        // Obtener el nombre del contacto desde el primer mensaje con source "telegram"
        const telegramMessage = messagesData.find(msg => msg.source === 'telegram');
        const contactName = telegramMessage
          ? `${telegramMessage.firstName || ''} ${telegramMessage.lastName || ''}`.trim() || `Chat ${chatId}`
          : `Chat ${chatId}`;

        const basicContact: ChatContact = {
          id: parseInt(chatId) || 0,
          chatId: chatId,
          name: contactName,
          avatar: '/perfil.png',
          platform: 'telegram',
          hasBudget: true,
          clientId: undefined, // Se obtendría del backend si el cliente existe
        };
        
        setContact(basicContact);

        // Convertir mensajes del backend a formato ChatMessage
        const formattedMessages: ChatMessage[] = messagesData.map((msg) => {
          const messageDate = new Date(msg.timestamp);
          const isSent = msg.source === 'konfex';
          
          return {
            id: msg.id,
            text: msg.text,
            time: messageDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            date: messageDate.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            isSent,
            senderAvatar: isSent ? '/perfil.png' : undefined,
            firstName: msg.firstName ?? null,
            lastName: msg.lastName ?? null,
            username: msg.username ?? null,
            type: msg.type || 'text',
            fileUrl: msg.fileUrl ?? null,
            filePath: msg.filePath ?? null,
            mimeType: msg.mimeType ?? null,
            fileSize: msg.fileSize ?? null,
          };
        });

        setMessages(formattedMessages);
      } catch (error) {
        // En caso de error, usar valores por defecto
        const basicContact: ChatContact = {
          id: parseInt(chatId) || 0,
          chatId: chatId,
          name: `Chat ${chatId}`,
          avatar: '/perfil.png',
          platform: 'telegram',
          hasBudget: true,
          clientId: undefined,
        };
        setContact(basicContact);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [chatId]);

  useEffect(() => {
    socketRef.current = getSocket();

    const socket = socketRef.current;

    const handleTelegramMessage = (telegramMessage: TelegramMessage) => {
      const messageChatId = String(telegramMessage.chatId);
      const currentChatId = String(chatId);
      
      if (messageChatId !== currentChatId) {
        return;
      }

      const messageDate = new Date(telegramMessage.timestamp);
      
      if (isNaN(messageDate.getTime())) {
        console.warn('⚠️ Fecha inválida en mensaje, usando fecha actual');
        messageDate.setTime(Date.now());
      }
      
      const messageId = messageDate.getTime() + Math.random();
      const newMessage: ChatMessage = {
        id: messageId,
        text: telegramMessage.text?.trim() || null,
        time: messageDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: messageDate.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        isSent: false,
        senderAvatar: undefined,
        firstName: telegramMessage.firstName ?? null,
        lastName: telegramMessage.lastName ?? null,
        username: telegramMessage.username ?? null,
        type: telegramMessage.type || (telegramMessage.text ? 'text' : undefined),
        fileUrl: telegramMessage.fileUrl ?? null,
        filePath: telegramMessage.filePath ?? null,
        mimeType: telegramMessage.mimeType ?? null,
        fileSize: telegramMessage.fileSize ?? null,
      };

      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => {
          const timeDiff = Math.abs(msg.id - messageId);
          return msg.text === newMessage.text && timeDiff < 1000;
        });
        
        if (messageExists) {
          return prevMessages;
        }
        
        return [...prevMessages, newMessage];
      });
    };

    const setupListeners = () => {
      if (!socket.io.opts.autoConnect) {
        console.warn('⚠️ Socket deshabilitado (no auto-connect). Socket.IO no disponible.');
        return;
      }

      if (!socket.connected) {
        const timeout = setTimeout(() => {
          console.warn('⚠️ Timeout esperando conexión Socket.IO. Los mensajes en tiempo real no estarán disponibles.');
          console.warn('💡 Los mensajes seguirán funcionando mediante polling manual');
        }, 10000);

        const onConnect = () => {
          clearTimeout(timeout);
          setupListeners();
        };
        
        const onConnectError = (error: Error) => {
          clearTimeout(timeout);
          console.warn('⚠️ No se pudo conectar a Socket.IO:', error.message);
          console.warn('💡 Los mensajes seguirán funcionando mediante polling manual');
        };
        
        socket.once('connect', onConnect);
        socket.once('connect_error', onConnectError);
        
        return;
      }

      socket.on('telegram_message', handleTelegramMessage);
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

    return () => {
      socket.off('telegram_message', handleTelegramMessage);
      socket.off('connect', setupListeners);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const socket = socketRef.current;
    const textToSend = messageText.trim();

    const tempId = Date.now();
    const now = new Date();
    const newMessage: ChatMessage = {
      id: tempId,
      text: textToSend,
      time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      isSent: true,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    if (socket && socket.connected) {
      socket.emit('konfex_send_message', {
        chatId: chatId,
        text: textToSend,
        timestamp: new Date().toISOString(),
          firstName: 'Konfex',
          lastName: 'User',
          username: 'konfex_user',
      });

      socket.once('telegram:send_error', (error) => {
      });
    } else {
      console.warn('⚠️ Socket.IO no está conectado. El mensaje se mostrará localmente pero no se enviará al backend.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    contact,
    messages,
    isLoading,
    messageText,
    setMessageText,
    sendMessage,
    handleKeyPress,
  };
};

