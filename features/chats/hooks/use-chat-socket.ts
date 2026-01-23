/* eslint-disable react-hooks/set-state-in-effect */
import { getSocket } from "@/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { CreateMessage, Message } from "../interfaces/message-interface";
import { TypedSocket } from "../interfaces/socket-interface";

interface UseChatSocketProps {
    token: string;
    currentUserId: string;
    activeRecipientId?: string;
}

export function useChatSocket({ token, currentUserId, activeRecipientId }: UseChatSocketProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<TypedSocket | null>(null);

    const socketRef = useRef<TypedSocket | null>(null);

    useEffect(() => {
        if (!token) return;

        const socketInstance: TypedSocket = getSocket(token);
        socketRef.current = socketInstance;
        setSocket(socketInstance);

        if (!socketInstance.connected) {
            socketInstance.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        const onMessageReceived = (newMessage: Message) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMessage.id)) return prev;

                const isFromActiveChat = newMessage.senderId === activeRecipientId;
                const isFromMe = newMessage.senderId === currentUserId;

                return isFromActiveChat || isFromMe ? [...prev, newMessage] : prev;
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
    }, [token, activeRecipientId, currentUserId]);

    const sendMessage = useCallback(async (content: string, recipientId: string): Promise<Message> => {
        const socketInstance = socketRef.current;

        if (!socketInstance?.connected) {
            throw new Error("Socket not connected");
        }

        const payload: CreateMessage = {
            recipientId,
            content,
        };

        return new Promise((resolve, reject) => {
            socketInstance.emit("sendMessage", payload, (response) => {
                if (response?.id) {
                    setMessages((prev) => [...prev, response]);
                    resolve(response);
                } else {
                    reject(new Error("Failed to send message"));
                }
            });
        });
    }, []);

    const markMessageAsRead = useCallback((conversationId: string, recipientId: string) => {
        const socketInstance = socketRef.current;
        if (!socketInstance?.connected) return;

        socketInstance.emit("markConversationAsRead", {
            conversationId,
            recipientId,
        });
    }, []);

    return {
        socket,
        isConnected,
        messages,
        setMessages,
        sendMessage,
        markMessageAsRead,
    };
}
