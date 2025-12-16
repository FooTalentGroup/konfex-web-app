import { useState, useMemo, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ChatItemProps } from "@/components/inbox/ChatItem";
import { apiClient } from "@/config/apiClient";
import { getSocket } from "@/services/socket.service";

export type FilterType = "all" | "unread" | "read";

interface TelegramChatResponse {
  chatId: string;
  name: string;
  lastMessage: string;
  lastMessageSource: string;
  timestamp: Date | string;
  hasBudget: boolean;
  unreadCount?: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const socketRef = useRef<Socket | null>(null);
  const chatsMapRef = useRef<Map<string, ChatItemProps>>(new Map());

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient<ApiResponse>("/telegram/chats");

        const chatsData = response.data || [];

        const chatsList: ChatItemProps[] = chatsData.map((chat) => {
          const message =
            chat.lastMessageSource === "konfex"
              ? `Tu:  ${chat.lastMessage || ""}`
              : chat.lastMessage || "";

          const isRead = (chat.unreadCount ?? 0) === 0;

          const chatItem: ChatItemProps = {
            id: Number(chat.chatId) || 0,
            avatar: "/imagenChat.png",
            name: chat.name || `Chat ${chat.chatId}`,
            message,
            time: chat.timestamp
              ? new Date(chat.timestamp).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            hasBudget: chat.hasBudget || false,
            isRead,
          };

          return chatItem;
        });

        chatsMapRef.current.clear();
        chatsList.forEach((chat) => {
          chatsMapRef.current.set(String(chat.id), chat);
        });

        setChats(chatsList);
      } catch (error) {
        setChats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  const createChatItemFromMessage = (
    messageData: TelegramMessageData,
    existingChat?: ChatItemProps
  ): ChatItemProps => {
    const chatId = String(messageData.chatId);
    const name =
      messageData.firstName && messageData.lastName
        ? `${messageData.firstName} ${messageData.lastName}`.trim()
        : messageData.firstName ||
          messageData.lastName ||
          existingChat?.name ||
          `Chat ${chatId}`;

    const message =
      messageData.source === "konfex"
        ? `Tu:  ${messageData.text || ""}`
        : messageData.text || "";

    const time = messageData.timestamp
      ? new Date(messageData.timestamp).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });

    const isIncoming = messageData.source !== "konfex";
    const isRead = isIncoming ? false : existingChat?.isRead ?? false;

    return {
      id: Number(chatId) || 0,
      avatar: "/imagenChat.png",
      name,
      message,
      time,
      hasBudget: existingChat?.hasBudget || false,
      isRead,
    };
  };

  const updateChatFromMessage = (messageData: TelegramMessageData) => {
    const chatId = String(messageData.chatId);
    const existingChat = chatsMapRef.current.get(chatId);
    const chatItem = createChatItemFromMessage(messageData, existingChat);

    chatsMapRef.current.set(chatId, chatItem);

    const allChats = Array.from(chatsMapRef.current.values());

    const updatedChatIndex = allChats.findIndex(
      (chat) => String(chat.id) === chatId
    );
    if (updatedChatIndex > 0) {
      const [updatedChat] = allChats.splice(updatedChatIndex, 1);
      allChats.unshift(updatedChat);
    } else if (updatedChatIndex === -1) {
      allChats.unshift(chatItem);
    }

    setChats(allChats);
  };

  const markChatAsRead = async (chatId: number | string) => {
    const idStr = String(chatId);
    const existing = chatsMapRef.current.get(idStr);
    if (!existing || existing.isRead) return;

    try {
      await apiClient(`/telegram/chats/${idStr}/messages/read`, {
        method: "POST",
      });
    } catch (error) {
      console.warn("No se pudo marcar leído en backend:", error);
    }

    const updated = { ...existing, isRead: true };
    chatsMapRef.current.set(idStr, updated);

    setChats((prev) =>
      prev.map((chat) => (String(chat.id) === idStr ? updated : chat))
    );
  };

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    const handleTelegramMessage = (messageData: TelegramMessageData) => {
      if (messageData && messageData.chatId) {
        updateChatFromMessage(messageData);
      }
    };

    const setupListeners = () => {
      if (!socket.io.opts.autoConnect) {
        console.warn(
          "Socket deshabilitado (no auto-connect). Socket.IO no disponible."
        );
        return;
      }

      if (!socket.connected) {
        const onConnect = () => {
          setupListeners();
        };

        socket.once("connect", onConnect);
        return;
      }

      socket.on("telegram_message", handleTelegramMessage);
      socket.on("telegram:message", handleTelegramMessage);
      socket.on("telegram:new_message", handleTelegramMessage);
      socket.on("message:telegram", handleTelegramMessage);
    };

    if (socket.connected) {
      setupListeners();
    } else {
      socket.once("connect", setupListeners);

      try {
        if (!socket.connected) {
          socket.connect();
        }
      } catch (error) {
        console.warn("No se pudo conectar el socket:", error);
      }
    }

    return () => {
      if (socket) {
        socket.off("telegram_message", handleTelegramMessage);
        socket.off("telegram:message", handleTelegramMessage);
        socket.off("telegram:new_message", handleTelegramMessage);
        socket.off("message:telegram", handleTelegramMessage);
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

    if (activeFilter === "unread") {
      filtered = filtered.filter((chat) => !chat.isRead);
    } else if (activeFilter === "read") {
      filtered = filtered.filter((chat) => chat.isRead);
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
    markChatAsRead,
  };
}
