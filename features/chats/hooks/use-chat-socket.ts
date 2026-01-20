/* eslint-disable react-hooks/exhaustive-deps */
import { getSocket } from "@/lib/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { CreateMessage, Message } from "../interfaces";

interface UseChatSocketProps {
    token: string;
    currentUserId: string;
    activeRecipientId?: string; // ID lawan bicara yang sedang dibuka chatnya
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
            console.log("✅ Socket connected:", socket.id);
        }

        function onDisconnect(reason: string) {
            setIsConnected(false);
            console.log("❌ Socket disconnected:", reason);
        }

        function onConnectError(err: Error) {
            console.error("⚠️ Connection Error:", err.message);
        }

        /**
         * Handler untuk Pesan Masuk
         * Backend: this.server.to(recipientRoom).emit('message', response)
         */
        function onMessageReceived(newMessage: Message) {
            console.log("📩 New message received from socket:", newMessage);

            setMessages((prev) => {
                // 1. Hindari duplikasi pesan (terutama jika kita pengirimnya)
                if (prev.some((m) => m.id === newMessage.id)) return prev;

                // 2. Logic Filtering:
                // Tampilkan pesan hanya jika pesan itu berasal dari user yang chat-nya sedang kita buka
                // ATAU jika kita sendiri yang mengirim pesan tersebut (untuk sync antar tab/device)
                const isFromActiveChat = newMessage.senderId === activeRecipientId;
                const isFromMe = newMessage.senderId === currentUserId;

                if (isFromActiveChat || isFromMe) {
                    return [...prev, newMessage];
                }

                // Jika pesan untuk chat lain, abaikan (atau kamu bisa buat state 'unread' di sini)
                return prev;
            });
        }

        // Mendaftarkan listener
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("message", onMessageReceived);

        return () => {
            // Unregister semua listener saat component unmount atau token berubah
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.off("message", onMessageReceived);
        };
    }, [token, activeRecipientId]); // Re-run jika activeRecipientId berubah agar filter sinkron

    // Fungsi Send Message
    const sendMessage = useCallback(
        async (content: string, recipientId: string) => {
            const socket = socketRef.current;
            if (!socket || !socket.connected) {
                console.error("Cannot send message: Socket not connected");
                return;
            }

            // Payload sesuai DTO Backend (CreateMessageDto)
            const payload: CreateMessage = {
                recipientId,
                content,
            };

            // --- OPTIMISTIC UI UPDATE ---
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

            // Masukkan pesan ke UI terlebih dahulu agar terasa instant
            setMessages((prev) => [...prev, optimisticMessage]);

            // Emit event 'sendMessage' ke Backend
            // Menggunakan acknowledgement (callback) untuk konfirmasi dari server
            socket.emit("sendMessage", payload, (response: Message) => {
                if (response && response.id) {
                    // Jika sukses, ganti pesan temp dengan data asli dari database
                    setMessages((prev) => prev.map((msg) => (msg.id === tempId ? response : msg)));
                } else {
                    // Jika gagal (misal validasi backend gagal)
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === tempId ? { ...msg, isError: true, isPending: false } : msg)),
                    );
                }
            });
        },
        [currentUserId], // Dependency cukup currentUserId
    );

    return {
        socket: socketRef.current,
        isConnected,
        messages,
        setMessages, // Diexport agar bisa reset/load history dari page.tsx
        sendMessage,
    };
}
