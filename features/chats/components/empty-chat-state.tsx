import { MessageCircle, Settings } from "lucide-react";

export default function EmptyChatState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-32 h-32 relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse"></div>
                <div className="relative z-10 w-full h-full bg-linear-to-tr from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 transform hover:rotate-6 transition-transform duration-500">
                    <MessageCircle className="w-14 h-14 text-white" />
                </div>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">Selamat Datang di Nexus Chat</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
                Platform komunikasi yang aman, cepat, dan modern.
                <br />
                Mulai percakapan dengan memilih kontak di sebelah kiri.
            </p>
            <button className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-medium transition-all flex items-center gap-2">
                <Settings className="w-4 h-4" /> Personalize Theme
            </button>
        </div>
    );
}
