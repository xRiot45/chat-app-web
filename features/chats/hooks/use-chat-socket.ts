/* eslint-disable react-hooks/exhaustive-deps */
import { getSocket } from "@/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { CreateMessage, Message } from "../interfaces";

interface UseChatSocketProps {
    token: string;
    currentUserId: string;
    activeRecipientId?: string;
}

export function useChatSocket({ token, currentUserId, activeRecipientId }: UseChatSocketProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token) return;

        const socket = getSocket(token);
        socketRef.current = socket;

        if (!socket.connected) {
            socket.connect();
        }

        function onConnect() {
            setIsConnected(true);
            // console.log("Socket connected:", socket.id);
        }

        function onDisconnect() {
            setIsConnected(false);
            // console.log("Socket disconnected:", reason);
        }

        function onConnectError() {
            // console.error("Connection Error:", err.message);
        }

        // Listener for incoming messages
        function onMessageReceived(newMessage: Message) {
            setMessages((prev) => {
                if (prev.some((m) => m.id === newMessage.id)) return prev;

                const isFromActiveChat = newMessage.senderId === activeRecipientId;
                const isFromMe = newMessage.senderId === currentUserId;

                if (isFromActiveChat || isFromMe) {
                    return [...prev, newMessage];
                }

                return prev;
            });
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("message", onMessageReceived);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("message", onMessageReceived);
        };
    }, [token, activeRecipientId]);

    // Function to send a message
    const sendMessage = useCallback(
        async (content: string, recipientId: string) => {
            const socket = socketRef.current;
            if (!socket || !socket.connected) {
                console.error("Cannot send message: Socket not connected");
                return;
            }

            const payload: CreateMessage = {
                recipientId,
                content,
            };

            const tempId = `temp-${Date.now()}`;
            const optimisticMessage: Message = {
                id: tempId,
                content: content,
                senderId: currentUserId,
                conversationId: "temp",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sender: {
                    id: currentUserId,
                    username: "Me",
                    status: "ONLINE",
                },
                isPending: true,
            };

            setMessages((prev) => [...prev, optimisticMessage]);

            // Emit event 'sendMessage' to Backend
            socket.emit("sendMessage", payload, (response: Message) => {
                if (response && response.id) {
                    setMessages((prev) => prev.map((msg) => (msg.id === tempId ? response : msg)));
                } else {
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === tempId ? { ...msg, isError: true, isPending: false } : msg)),
                    );
                }
            });
        },
        [currentUserId],
    );

    return {
        socket: socketRef.current,
        isConnected,
        messages,
        setMessages,
        sendMessage,
    };
}
