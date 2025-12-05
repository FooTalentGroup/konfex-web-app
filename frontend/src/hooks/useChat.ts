import { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/services/socket.service';
import { apiClient } from '@/config/apiClient';

export interface ChatMessage {
  id: number;
  text?: string | null;
  time: string;
  date?: string; // Fecha completa para separadores de día
  isSent: boolean;
  senderAvatar?: string;
  // Soporte multimedia
  type?: 'text' | 'photo' | 'document';
  fileUrl?: string | null;
  mimeType?: string | null;
  filePath?: string | null;
  fileSize?: number | null;
}

export interface ChatContact {
  id: number;
  chatId: string;
  nombre: string;
  avatar?: string;
  plataforma: 'telegram';
  tienePresupuesto?: boolean;
}

export interface TelegramMessage {
  chatId: string | number;
  text?: string | null;
  source: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  timestamp: string;
  // multimedia
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

  // Obtener mensajes históricos y datos del contacto
  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        // Obtener mensajes del chat
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
          console.log('telegramMessage', telegramMessage);
        const contactName = telegramMessage
          ? `${telegramMessage.firstName || ''} ${telegramMessage.lastName || ''}`.trim() || `Chat ${chatId}`
          : `Chat ${chatId}`;

        const basicContact: ChatContact = {
          id: parseInt(chatId) || 0,
          chatId: chatId,
          nombre: contactName,
          avatar: '/perfil.png',
          plataforma: 'telegram',
          tienePresupuesto: true,
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
            senderAvatar: '/perfil.png',
            type: msg.type || 'text',
            fileUrl: msg.fileUrl ?? null,
            filePath: msg.filePath ?? null,
            mimeType: msg.mimeType ?? null,
            fileSize: msg.fileSize ?? null,
          };
        });

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error al obtener mensajes del chat:', error);
        // En caso de error, usar valores por defecto
        const basicContact: ChatContact = {
          id: parseInt(chatId) || 0,
          chatId: chatId,
          nombre: `Chat ${chatId}`,
          avatar: '/perfil.png',
          plataforma: 'telegram',
          tienePresupuesto: true,
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
      console.log('📨 Mensaje recibido de Telegram:', telegramMessage);
      
      const messageChatId = String(telegramMessage.chatId);
      const currentChatId = String(chatId);
      
      if (messageChatId !== currentChatId) {
        console.log('⏭️ Mensaje ignorado - chatId no coincide:', messageChatId, 'vs', currentChatId);
        return;
      }

      console.log('✅ Mensaje aceptado para este chat');

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
        senderAvatar: '/perfil.png',
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
          console.log('⚠️ Mensaje duplicado ignorado');
          return prevMessages;
        }
        
        console.log('➕ Nuevo mensaje agregado:', {
          id: newMessage.id,
          text: newMessage.text?.substring(0, 50) + (newMessage.text?.length || 0 > 50 ? '...' : ''),
          time: newMessage.time,
        });
        
        return [...prevMessages, newMessage];
      });
    };

    const setupListeners = () => {
      if (!socket.io.opts.autoConnect) {
        console.warn('⚠️ Socket deshabilitado (no auto-connect). Socket.IO no disponible.');
        return;
      }

      if (!socket.connected) {
        console.log('⏳ Socket no conectado aún, esperando conexión...');
        
        const timeout = setTimeout(() => {
          console.warn('⚠️ Timeout esperando conexión Socket.IO. Los mensajes en tiempo real no estarán disponibles.');
          console.warn('💡 Los mensajes seguirán funcionando mediante polling manual');
        }, 10000);

        const onConnect = () => {
          clearTimeout(timeout);
          console.log('✅ Socket conectado, configurando listeners...');
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

      console.log('🔌 Socket conectado:', socket.connected);
      console.log('📡 Escuchando mensajes para chatId:', chatId);
      console.log('👂 Registrando listeners de socket...');
      
      socket.on('telegram_message', handleTelegramMessage);
      console.log('✅ Listeners registrados para eventos: telegram_message');
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
      console.log('🧹 Limpiando listeners de socket para chatId:', chatId);
      socket.off('telegram_message', handleTelegramMessage);
      socket.off('connect', setupListeners);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    const socket = socketRef.current;
    const textToSend = messageText.trim();

    console.log('📤 Enviando mensaje:', { chatId, text: textToSend });

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

      console.log('➕ Mensaje agregado localmente con ID temporal:', tempId);

    if (socket && socket.connected) {
        console.log('🔌 Socket.IO conectado, enviando mensaje al backend...');
      socket.emit('konfex_send_message', {
        chatId: chatId,
        text: textToSend,
        timestamp: new Date().toISOString(),
          firstName: 'Konfex', // Datos de usuario estáticos por ahora colocar usuario de la sessión
          lastName: 'User',
          username: 'konfex_user',
      }, (response: never) => {
        console.log('✅ Respuesta del servidor:', response);
      });

      socket.once('telegram:send_success', (data) => {
        console.log('✅ Mensaje enviado exitosamente:', data);
      });

      socket.once('telegram:send_error', (error) => {
        console.error('❌ Error al enviar mensaje:', error);
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

