import { Search, X } from "lucide-react";

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SearchInput({ placeholder, value, onChange, className }: SearchInputProps) {
    return (
        <div className="px-5 pb-2 shrink-0">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />

                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className={`${className} w-full h-11 pl-10 pr-10 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-black/40 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:text-slate-200`}
                />

                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-500 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
