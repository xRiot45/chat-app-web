import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SHARED_MEDIA } from "@/constants/shared-media";
import { cn } from "@/lib/utils";
import { Bell, Blocks, Download, FileText, Heart, Search, X } from "lucide-react";
import Image from "next/image";
import { ActiveChatSession } from "../interfaces";

interface ChatDirectoryViewProps {
    selectedChat: ActiveChatSession;
    onClose: () => void;
}

export const ChatDirectoryView = ({ selectedChat, onClose }: ChatDirectoryViewProps) => {
    return (
        <aside
            className={cn(
                "h-full z-50 flex flex-col transition-all duration-300 border-l border-slate-200 dark:border-white/5",
                "fixed inset-0 w-full bg-white/95 dark:bg-[#0f1115]/95 backdrop-blur-xl",
                "lg:relative lg:w-100 lg:bg-white/60 lg:dark:bg-[#0f1115]/80 lg:backdrop-blur-2xl",
            )}
        >
            {/* Header Right */}
            <div className="h-19 flex items-center px-6 border-b border-slate-200/50 dark:border-white/5 font-bold text-lg shrink-0">
                <span className="text-slate-800 dark:text-white">Directory</span>
                <button
                    onClick={() => onClose()}
                    className="ml-auto lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-6 h-6 text-slate-500 dark:text-slate-300" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* Profile Info */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative">
                        <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100 dark:ring-white/5 shadow-xl">
                            <AvatarImage src={selectedChat.avatar} />
                            <AvatarFallback>{selectedChat.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {selectedChat.status === "ONLINE" && (
                            <span className="absolute bottom-5 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0f1115] rounded-full"></span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedChat.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        @{selectedChat.name.toLowerCase().replace(/\s/g, "")}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Building the future of web development with strict deadlines. 🚀
                    </p>

                    <div className="flex gap-4 mt-6 w-full">
                        <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Bell className="w-5 h-5 mb-1" />
                            Mute
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Search className="w-5 h-5 mb-1" />
                            Search
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Heart className="w-5 h-5 mb-1" />
                            Fav
                        </button>
                    </div>
                </div>

                {/* Shared Media */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Shared Media</h4>
                        <button className="text-indigo-500 text-xs hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {SHARED_MEDIA.filter((m) => m.type === "image").map((media) => (
                            <div
                                key={media.id}
                                className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-white/5"
                            >
                                <Image
                                    height={200}
                                    width={200}
                                    src={media.src || ""}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    alt="media"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shared Files */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Documents</h4>
                    </div>
                    <div className="space-y-3">
                        {SHARED_MEDIA.filter((m) => m.type === "file").map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors group"
                            >
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">
                                        {file.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500">{file.size} • PDF</p>
                                </div>
                                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 pb-6">
                    <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                        <Blocks className="w-4 h-4" /> Block User
                    </button>
                </div>
            </div>
        </aside>
    );
};
