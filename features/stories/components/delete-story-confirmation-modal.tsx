"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export default function DeleteStoryConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-120! flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
           <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" 
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoading) onClose();
                }} 
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-[320px] bg-[#1a1d23] border border-white/10 rounded-[24px] p-6 shadow-2xl overflow-hidden">
                <div className="flex flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>

                    <h3 className="text-white text-lg font-bold mb-2">Delete Story?</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                        This action cannot be undone. Your followers will no longer be able to see this story.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col w-full gap-2">
                        <button
                            disabled={isLoading}
                            onClick={onConfirm}
                            className={cn(
                                "w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2",
                                isLoading && "opacity-70 cursor-not-allowed",
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Story"
                            )}
                        </button>

                        <button
                            disabled={isLoading}
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
