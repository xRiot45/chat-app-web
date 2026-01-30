"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Story } from "../interfaces/story";

export interface StoryViewerProps {
    stories: Story[];
    initialIndex: number;
    onClose: () => void;
}

export const StoryViewerModal = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentStory = stories[currentIndex];

    const getFullUrl = (path: string | null) => {
        if (!path) return null;
        const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}/api/public${cleanPath}`;
    };

    const imageUrl = getFullUrl(currentStory.imageUrl);
    const videoUrl = getFullUrl(currentStory.videoUrl);
    const avatarUrl = getFullUrl(currentStory.user.avatarUrl);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

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
            {imageUrl && (
                <div
                    className="absolute inset-0 opacity-40 bg-center bg-cover blur-3xl scale-110 transition-all duration-500"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            )}

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
                                )}
                            />
                        </div>
                    ))}
                </div>

                {/* 2. Header Information */}
                <div className="absolute top-4 left-0 right-0 p-4 z-40 flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/20">
                            <AvatarImage
                                src={avatarUrl || ""}
                                alt={currentStory.user.fullName}
                                crossOrigin="anonymous" // Penting untuk masalah CORS
                            />
                            <AvatarFallback className="bg-slate-700 text-white">
                                {currentStory.user.fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white font-bold text-sm drop-shadow-md">{currentStory.user.fullName}</p>
                            <p className="text-white/70 text-xs drop-shadow-md">{formatTime(currentStory.createdAt)}</p>
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
                <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                    {videoUrl ? (
                        <video
                            src={videoUrl}
                            className="w-full h-auto max-h-full object-contain"
                            autoPlay
                            muted
                            playsInline
                            crossOrigin="anonymous"
                        />
                    ) : (
                        /* Menggunakan tag img standar untuk menghindari masalah hostname next.config.js & COEP */
                        <Image
                            fill
                            src={imageUrl || ""}
                            className="w-full h-auto max-h-full object-contain pointer-events-none select-none"
                            alt={currentStory.caption || "Story Content"}
                            crossOrigin="anonymous"
                            priority
                            unoptimized
                        />
                    )}

                    {/* Invisible Click Targets for Navigation */}
                    <div
                        className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
                        onClick={handlePrev}
                        title="Previous"
                    />
                    <div
                        className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
                        onClick={handleNext}
                        title="Next"
                    />

                    {/* Caption Overlay */}
                    {currentStory.caption && (
                        <div className="absolute bottom-10 left-0 right-0 p-6 text-center z-30">
                            <p className="text-white text-sm drop-shadow-lg bg-black/40 backdrop-blur-md py-2 px-4 rounded-lg inline-block max-w-[80%]">
                                {currentStory.caption}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Desktop Navigation Controls */}
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
