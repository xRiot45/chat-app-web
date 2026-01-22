/* eslint-disable react-hooks/set-state-in-effect */
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

    // [UPDATE 1] Gunakan State agar Parent Component (HomeView) tahu kapan socket siap
    const [socket, setSocket] = useState<Socket | null>(null);

    // Ref tetap digunakan untuk internal logic (sendMessage) agar tidak stale closure
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token) return;

        const socketInstance = getSocket(token);

        // Simpan ke Ref (untuk internal function) & State (untuk dilempar ke parent)
        socketRef.current = socketInstance;
        setSocket(socketInstance);

        if (!socketInstance.connected) {
            socketInstance.connect();
        }

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        // Listener pesan untuk ACTIVE CHAT (Chat yang sedang dibuka)
        function onMessageReceived(newMessage: Message) {
            setMessages((prev) => {
                // Cegah duplikasi pesan
                if (prev.some((m) => m.id === newMessage.id)) return prev;

                // Logika Filter:
                // Masukkan pesan ke state 'messages' HANYA JIKA:
                // 1. Pesan datang dari orang yang sedang kita chat (activeRecipientId)
                // 2. ATAU Pesan itu kita yang kirim (agar muncul realtime di layar kita sendiri)
                const isFromActiveChat = newMessage.senderId === activeRecipientId;
                const isFromMe = newMessage.senderId === currentUserId;

                // [PENTING] Kita cek juga conversationId jika ada, untuk keamanan ganda
                // const isSameConversation = newMessage.conversationId === activeConversationId;

                if (isFromActiveChat || isFromMe) {
                    return [...prev, newMessage];
                }

                return prev;
            });
        }

        // Event Listeners
        socketInstance.on("connect", onConnect);
        socketInstance.on("disconnect", onDisconnect);
        // Pastikan nama event ini sesuai dengan Backend ('message' atau 'receive_message')
        // Biasanya untuk chat room event-nya 'message', untuk notif global 'receive_message'
        socketInstance.on("message", onMessageReceived);

        return () => {
            socketInstance.off("connect", onConnect);
            socketInstance.off("disconnect", onDisconnect);
            socketInstance.off("message", onMessageReceived);
        };
    }, [token, activeRecipientId, currentUserId]);

    // Function to send a message
    const sendMessage = useCallback(
        async (content: string, recipientId: string) => {
            const socketInstance = socketRef.current;
            if (!socketInstance || !socketInstance.connected) {
                console.error("Cannot send message: Socket not connected");
                return;
            }

            const payload: CreateMessage = {
                recipientId,
                content,
            };

            const tempId = `temp-${Date.now()}`;

            // Optimistic UI Update
            const optimisticMessage: Message = {
                id: tempId,
                content: content,
                senderId: currentUserId,
                conversationId: "temp", // Backend akan mengembalikan ID asli nanti
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sender: {
                    id: currentUserId,
                    username: "Me",
                    fullName: "Me",
                    avatarUrl: "",
                    status: "ONLINE",
                },
                isPending: true,
                isRead: false,
            };

            setMessages((prev) => [...prev, optimisticMessage]);

            // Emit event 'sendMessage' to Backend
            socketInstance.emit("sendMessage", payload, (response: Message) => {
                if (response && response.id) {
                    // Sukses: Ganti pesan temp dengan pesan asli dari server
                    setMessages((prev) => prev.map((msg) => (msg.id === tempId ? response : msg)));
                } else {
                    // Gagal: Tandai error
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === tempId ? { ...msg, isError: true, isPending: false } : msg)),
                    );
                }
            });
        },
        [currentUserId],
    );

    return {
        socket, // [UPDATE 2] Return socket state object
        isConnected,
        messages,
        setMessages,
        sendMessage,
    };
}
