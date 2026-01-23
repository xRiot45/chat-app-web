import { useEffect, useRef, useState } from "react";
import { getMessagesQuery } from "../application/queries/get-message-query";
import { getRecentMessagesQuery } from "../application/queries/get-recent-message-query";
import { ActiveChatSession } from "../interfaces";
import { ChatConversation } from "../interfaces/message-interface";
import { useChatSocket } from "./use-chat-socket";

interface UseChatManagerProps {
    token: string;
    currentUserId: string;
    selectedChat: ActiveChatSession | null;
}

export const useChatManager = ({ token, currentUserId, selectedChat }: UseChatManagerProps) => {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Inisialisasi Socket Hook
    const { messages, sendMessage, setMessages, socket, markMessageAsRead } = useChatSocket({
        token,
        currentUserId,
        activeRecipientId: selectedChat?.recipientId,
    });

    // --- 1. INITIAL LOAD: Fetch Recent Conversations ---
    useEffect(() => {
        const fetchRecentMessages = async () => {
            try {
                const data = await getRecentMessagesQuery();
                setConversations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load recent messages:", error);
                setConversations([]);
            }
        };
        fetchRecentMessages();
    }, []);

    // --- 2. REAL-TIME: Socket Listeners (Sidebar & Read Status) ---
    useEffect(() => {
        if (!socket) return;

        const handleSidebarUpdate = (newMessage: any) => {
            setConversations((prev) => {
                const updatedList = [...prev];
                const existingIndex = updatedList.findIndex((c) => c.id === newMessage.conversationId);

                if (existingIndex !== -1) {
                    const chatToUpdate = { ...updatedList[existingIndex] };
                    chatToUpdate.lastMessage = {
                        id: newMessage.id,
                        content: newMessage.content,
                        createdAt: newMessage.createdAt,
                        senderId: newMessage.senderId,
                        isRead: false,
                    };

                    if (newMessage.senderId !== currentUserId) {
                        chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
                    }

                    updatedList.splice(existingIndex, 1);
                    updatedList.unshift(chatToUpdate);
                }
                return updatedList;
            });
        };

        const handleMessageRead = (data: { conversationId: string; readBy: string }) => {
            setConversations((prev) =>
                prev.map((chat) => {
                    if (chat.id === data.conversationId) {
                        if (data.readBy !== currentUserId) {
                            if (chat.lastMessage?.senderId === currentUserId) {
                                return { ...chat, lastMessage: { ...chat.lastMessage, isRead: true } };
                            }
                        }
                        if (data.readBy === currentUserId) return { ...chat, unreadCount: 0 };
                    }
                    return chat;
                }),
            );

            setMessages((prev) => {
                if (data.readBy !== currentUserId) {
                    return prev.map((msg) => ({ ...msg, isRead: true }));
                }
                return prev;
            });
        };

        socket.on("message", handleSidebarUpdate);
        socket.on("messageRead", handleMessageRead);

        return () => {
            socket.off("message", handleSidebarUpdate);
            socket.off("messageRead", handleMessageRead);
        };
    }, [socket, currentUserId, setMessages]);

    // --- 3. SELECTION LOGIC: Load Messages when Chat selected ---
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat?.recipientId) return;

            setMessages([]);
            try {
                const fetchedMessages = await getMessagesQuery(selectedChat.recipientId);
                setMessages(fetchedMessages);

                if (selectedChat.conversationId) {
                    markMessageAsRead(selectedChat.conversationId, selectedChat.recipientId);
                    setConversations((prev) =>
                        prev.map((chat) =>
                            chat.id === selectedChat.conversationId ? { ...chat, unreadCount: 0 } : chat,
                        ),
                    );
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        loadMessages();
    }, [selectedChat?.recipientId, selectedChat?.conversationId, setMessages, markMessageAsRead]);

    // --- 4. UX: Auto Scroll ---
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // --- 5. ACTION: Wrapped Send Message ---
    const onSendMessage = (content: string) => {
        if (!selectedChat) return;

        sendMessage(content, selectedChat.recipientId);

        // Optimistic Update Sidebar
        setConversations((prev) => {
            const updatedList = [...prev];
            const chatIndex = updatedList.findIndex(
                (c) => c.id === selectedChat.conversationId || c.recipient?.id === selectedChat.recipientId,
            );

            const lastMsg = {
                id: `temp-${Date.now()}`,
                content,
                createdAt: new Date(),
                senderId: currentUserId,
                isRead: false,
            };

            if (chatIndex !== -1) {
                const activeChat = { ...updatedList[chatIndex], lastMessage: lastMsg };
                updatedList.splice(chatIndex, 1);
                updatedList.unshift(activeChat);
            }
            return updatedList;
        });
    };

    return {
        conversations,
        messages,
        onSendMessage,
        messagesEndRef,
        setConversations,
    };
};
