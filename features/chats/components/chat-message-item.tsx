"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, Share2 } from "lucide-react";
import { Message } from "../interfaces";

interface ChatMessageItemProps {
    message: Message;
    isMe: boolean;
}

export default function ChatMessageItem({ message, isMe }: ChatMessageItemProps) {
    const formattedTime = format(new Date(message.createdAt), "HH:mm");

    return (
        <div className={cn("flex w-full group", isMe ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[85%] lg:max-w-[65%] gap-3", isMe ? "flex-row-reverse" : "flex-row")}>
                {!isMe && (
                    <div className="w-8 shrink-0 flex flex-col justify-end">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={message.sender.avatarUrl} />
                            <AvatarFallback>{message.sender.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                )}

                <div className="flex flex-col gap-1 min-w-0">
                    {!isMe && (
                        <span className="text-[10px] text-slate-400 ml-1 mb-0.5">
                            {message.sender.fullName || message.sender.username}
                        </span>
                    )}

                    <div
                        className={cn(
                            "relative  px-4 py-3 shadow-sm text-[15px] leading-relaxed transition-all duration-200 wrap-break-word",
                            isMe
                                ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-sm"
                                : "bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm hover:border-slate-300 dark:hover:border-white/20",
                        )}
                    >
                        {/* Content Text */}
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {/* Timestamp & Status */}
                        <div
                            className={cn(
                                "flex items-center justify-end gap-1 mt-2 text-[10px]",
                                isMe ? "text-indigo-200" : "text-slate-400",
                            )}
                        >
                            <span>{formattedTime}</span>
                            {isMe && <Check className="w-3.5 h-3.5" />}
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity flex items-center self-center",
                        isMe ? "mr-2" : "ml-2",
                    )}
                >
                    <button className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
