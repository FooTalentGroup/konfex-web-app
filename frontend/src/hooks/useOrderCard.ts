import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

interface UseOrderCardProps {
  telegramChatId?: string;
}

export const useOrderCard = ({ telegramChatId }: UseOrderCardProps) => {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { showSuccess, showError } = useToast();

  const sendTelegramMessage = async () => {
    if (!message.trim()) {
      showError('Por favor escribe un mensaje');
      return;
    }

    if (!telegramChatId) {
      showError('No hay chatId de Telegram disponible para este pedido');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('https://konfex-web-app-2.onrender.com/api/v1/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: telegramChatId,
          text: message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al enviar mensaje' }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      await response.json();
      showSuccess('Mensaje enviado exitosamente');
      setMessage('');
      setShowMessageInput(false);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  const handleTelegramClick = () => {
    setShowMessageInput(true);
  };

  const handleCancel = () => {
    setShowMessageInput(false);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTelegramMessage();
    }
  };

  return {
    showMessageInput,
    message,
    setMessage,
    isSending,
    sendTelegramMessage,
    handleTelegramClick,
    handleCancel,
    handleKeyPress,
  };
};

