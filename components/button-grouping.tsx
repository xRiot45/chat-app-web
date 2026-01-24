"use client";

import { useThemeContext } from "@/providers/theme-provider";
import { Moon, Plus, Settings, Sun } from "lucide-react";

interface ButtonGroupingProps {
    setIsAddModalOpen: (value: boolean) => void;
    setIsSettingsOpen: (value: boolean) => void;
}

export default function ButtonGrouping({ setIsAddModalOpen, setIsSettingsOpen }: ButtonGroupingProps) {
    const { isDarkMode, toggleTheme, mounted } = useThemeContext();

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-transform active:scale-95 flex items-center justify-center"
            >
                <Plus className="w-5 h-5" />
            </button>

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
            >
                {!mounted ? (
                    <div className="w-5 h-5" />
                ) : isDarkMode ? (
                    <Sun className="w-5 h-5 text-amber-300" />
                ) : (
                    <Moon className="w-5 h-5 text-indigo-600" />
                )}
            </button>

            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
                <Settings className="w-5 h-5 text-slate-500" />
            </button>
        </div>
    );
}
