/* eslint-disable react-hooks/set-state-in-effect */
import { getSocket } from "@/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../interfaces/message-interface";
import { TypedSocket } from "../interfaces/socket-interface";

interface UseChatSocketProps {
    token: string;
    currentUserId: string;
    activeChat: {
        recipientId?: string;
        conversationId?: string;
        groupId?: string;
    };
}

export function useChatSocket({ token, currentUserId, activeChat }: UseChatSocketProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<TypedSocket | null>(null);

    const socketRef = useRef<TypedSocket | null>(null);

    // --- 1. SETUP SOCKET LISTENERS ---
    useEffect(() => {
        if (!token) return;

        // Inisialisasi Socket (Singleton pattern via getSocket)
        const socketInstance = getSocket(token);
        socketRef.current = socketInstance;
        setSocket(socketInstance);

        if (!socketInstance.connected) {
            socketInstance.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        /**
         * Handler ketika pesan diterima dari Server (Broadcast).
         * Ini adalah SATU-SATUNYA tempat kita update state messages.
         */
        const onMessageReceived = (newMessage: Message) => {
            setMessages((prev) => {
                // A. Deduplikasi: Cek jika pesan dengan ID ini sudah ada
                if (prev.some((m) => m.id === newMessage.id)) {
                    return prev;
                }

                let isRelevant = false;

                // B. Filter Relevansi: Apakah pesan ini untuk chat yang sedang dibuka?
                if (newMessage.groupId) {
                    // --- SKENARIO GROUP CHAT ---
                    // Pesan relevan jika groupId pesan == groupId chat yang aktif
                    isRelevant = newMessage.groupId === activeChat?.groupId;
                } else {
                    // --- SKENARIO PERSONAL CHAT ---
                    // Pesan relevan jika conversationId cocok ATAU lawan bicaranya cocok
                    isRelevant =
                        (newMessage.conversationId && newMessage.conversationId === activeChat?.conversationId) ||
                        newMessage.senderId === activeChat?.recipientId ||
                        (newMessage.senderId === currentUserId && newMessage.recipientId === activeChat?.recipientId);
                }

                // C. Update State jika relevan
                return isRelevant ? [...prev, newMessage] : prev;
            });
        };

        socketInstance.on("connect", onConnect);
        socketInstance.on("disconnect", onDisconnect);
        socketInstance.on("message", onMessageReceived);

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("disconnect", onDisconnect);
            socketInstance.off("message", onMessageReceived);
        };
    }, [token, activeChat?.groupId, activeChat?.conversationId, activeChat?.recipientId, currentUserId]);

    // --- 2. SEND MESSAGE FUNCTION ---
    const sendMessage = useCallback(
        async (payload: { content: string; recipientId?: string; groupId?: string }): Promise<Message> => {
            const socketInstance = socketRef.current;

            if (!socketInstance?.connected) {
                throw new Error("Socket not connected");
            }

            return new Promise((resolve, reject) => {
                // Emit event 'sendMessage' ke server
                socketInstance.emit("sendMessage", payload, (response: Message) => {
                    if (response?.id) {
                        resolve(response);
                    } else {
                        reject(new Error("Failed to send message"));
                    }
                });
            });
        },
        [],
    );

    // --- 3. MARK AS READ FUNCTION ---
    const markMessageAsRead = useCallback((conversationId: string, recipientId: string) => {
        const socketInstance = socketRef.current;
        if (!socketInstance?.connected) return;

        // Fitur ini biasanya hanya untuk 1-on-1 chat
        socketInstance.emit("markConversationAsRead", {
            conversationId,
            recipientId,
        });
    }, []);

    return {
        socket,
        isConnected,
        messages,
        setMessages, // Diexpose jika perlu reset manual saat ganti chat
        sendMessage,
        markMessageAsRead,
    };
}
