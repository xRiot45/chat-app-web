import { MessageCircle } from "lucide-react";

export default function Application() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative mb-1">
                <div className="absolute inset-0 bg-indigo-500/40 blur-xl rounded-full animate-pulse"></div>
                <div className="relative z-10 w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg rotate-3 transform hover:rotate-0 transition-transform duration-300">
                    <MessageCircle className="w-5 h-5 text-white" />
                </div>
            </div>

            <div>
                <h1 className="font-bold text-base leading-tight text-slate-800 dark:text-white">Nexus Chat</h1>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Platform komunikasi modern</p>
            </div>
        </div>
    );
}
