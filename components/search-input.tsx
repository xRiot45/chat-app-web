import { Search } from "lucide-react";

export default function SearchInput() {
    return (
        <div className="px-5 pb-2 shrink-0">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    placeholder="Search people, groups, messages..."
                    className="w-full h-11 pl-10 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-black/40 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-slate-200"
                />
            </div>
        </div>
    );
}
