import { Socket } from "socket.io-client";
import { CreateMessage, Message } from ".";

export interface ServerToClientEvents {
    message: (message: Message) => void;
    connect: () => void;
    disconnect: () => void;
}

export interface ClientToServerEvents {
    sendMessage: (payload: CreateMessage, callback: (response: Message) => void) => void;
    markConversationAsRead: (payload: { conversationId: string; recipientId: string }) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
