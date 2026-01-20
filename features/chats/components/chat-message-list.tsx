"use client";

import React from "react";
import { Message } from "../interfaces";
import ChatMessageItem from "./chat-message-item";

interface ChatMessageListProps {
    messages: Message[];
    currentUserId: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessageList({ messages, currentUserId, messagesEndRef }: ChatMessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
            <div className="flex justify-center my-6">
                <span className="px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 border border-white/10 backdrop-blur-sm">
                    TODAY
                </span>
            </div>

            {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;

                return <ChatMessageItem key={msg.id} message={msg} isMe={isMe} />;
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
