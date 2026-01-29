"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { StoryViewerProps } from "../interfaces/story";

export const StoryViewerModal = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentStory = stories[currentIndex];

    // Handlers
    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-60 bg-black flex items-center justify-center animate-in fade-in duration-300">
            {/* Background Blur Dynamic */}
            <div
                className="absolute inset-0 opacity-40 bg-center bg-cover blur-3xl scale-110 transition-all duration-500"
                style={{ backgroundImage: `url(${currentStory.img})` }}
            />

            {/* Main Container */}
            <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-black md:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 z-10">
                {/* 1. Progress Indicators */}
                <div className="absolute top-0 left-0 right-0 p-3 z-40 flex gap-1.5">
                    {stories.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full bg-white transition-all duration-300",
                                    idx < currentIndex ? "w-full" : idx === currentIndex ? "w-full" : "w-0",
                                    // Note: w-full pada currentIndex biasanya dikontrol via timer CSS/JS
                                )}
                            />
                        </div>
                    ))}
                </div>

                {/* 2. Header Information */}
                <div className="absolute top-4 left-0 right-0 p-4 z-40 flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/20">
                            <AvatarImage src={currentStory.img} alt={currentStory.name} />
                            <AvatarFallback>{currentStory.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white font-bold text-sm drop-shadow-md">{currentStory.name}</p>
                            <p className="text-white/70 text-xs drop-shadow-md">{currentStory.time}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* 3. Main Content Area */}
                <div className="flex-1 relative flex items-center justify-center bg-black">
                    <Image
                        fill
                        src={currentStory.img}
                        className="w-full h-auto max-h-full object-contain"
                        alt="Story Content"
                        priority
                    />

                    {/* Invisible Click Targets for Mobile navigation */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-pointer" onClick={handlePrev} />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-pointer" onClick={handleNext} />
                </div>
            </div>

            {/* 5. Desktop Navigation Controls */}
            <button
                onClick={handlePrev}
                className={cn(
                    "hidden md:flex absolute left-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-20",
                    currentIndex === 0 && "opacity-0 pointer-events-none",
                )}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={handleNext}
                className={cn(
                    "hidden md:flex absolute right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-20",
                    currentIndex === stories.length - 1 && "opacity-0 pointer-events-none",
                )}
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );

    return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
};
