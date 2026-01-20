import { ImageIcon, Mic, Plus, Send, Smile } from "lucide-react";
import React from "react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
    return (
        <div className="p-4 md:px-6 md:pb-6 relative z-20">
            <form
                onSubmit={onSubmit}
                className="relative flex items-center gap-2 p-1.5 bg-white/80 dark:bg-[#15171c]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/5"
            >
                <div className="flex items-center gap-1 pl-2 ">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors hidden md:block"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 min-w-0 py-2">
                    <input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 px-2 focus:outline-none"
                        autoComplete="off"
                    />
                </div>

                <div className="flex items-center gap-1 pr-1 pb-1">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                    >
                        <Smile className="w-5 h-5" />
                    </button>
                    {value.trim() ? (
                        <button
                            type="submit"
                            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/40 transition-all active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="p-3 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
