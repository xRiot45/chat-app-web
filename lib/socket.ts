import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const CHAT_SOCKET_URL = `${API_BASE_URL.replace(/\/$/, "")}/chat`;

let socket: Socket;

// src/lib/socket.ts
export const getSocket = (token: string): Socket => {
    if (!socket) {
        socket = io(CHAT_SOCKET_URL, {
            query: {
                token: token,
            },
            transports: ["websocket"],
            autoConnect: false,
        });
    }
    return socket;
};
