/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Story } from "../interfaces/story";

interface StoryFeedProps {
    storyFeed: Story[];
    initialIndex: number;
    onClose: () => void;
}

export const StoryFeedModal = ({ storyFeed, initialIndex, onClose }: StoryFeedProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentStory = storyFeed[currentIndex];

    useEffect(() => {
        if (initialIndex !== undefined) setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const getFullUrl = (path: string | null) => {
        if (!path) return "";
        const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}/api/public${cleanPath}`;
    };

    if (!currentStory) return null;

    const imageUrl = getFullUrl(currentStory.imageUrl);
    const videoUrl = getFullUrl(currentStory.videoUrl);
    const avatarUrl = getFullUrl(currentStory.user.avatarUrl);

    const handleNext = () => {
        if (currentIndex < storyFeed.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return typeof document !== "undefined"
        ? createPortal(
              <div className="fixed inset-0 z-100 bg-black flex items-center justify-center animate-in fade-in duration-300">
                  {/* Glassmorphism Background (Ambient Light) */}
                  <div
                      className="absolute inset-0 opacity-50 bg-center bg-cover blur-[100px] scale-150 transition-all duration-1000"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                  />

                  <div className="relative w-full h-full md:max-w-105 md:h-[92vh] bg-black md:rounded-[24px] overflow-hidden flex flex-col shadow-2xl border border-white/5">
                      {/* WhatsApp Style Progress Bar */}
                      <div className="absolute top-0 left-0 right-0 p-3 z-50 flex gap-1 pt-4 px-4">
                          {storyFeed.map((_, idx) => (
                              <div key={idx} className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                                  <div
                                      className={cn(
                                          "h-full bg-white transition-all duration-300 ease-linear",
                                          idx < currentIndex ? "w-full" : idx === currentIndex ? "w-full" : "w-0",
                                      )}
                                  />
                              </div>
                          ))}
                      </div>

                      {/* Header (WhatsApp Look: Avatar kiri, Info tengah, Close kanan) */}
                      <div className="absolute top-6 left-0 right-0 p-4 z-50 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent">
                          <div className="flex items-center gap-3">
                              <button onClick={onClose} className="md:hidden text-white mr-1">
                                  <ChevronLeft className="w-6 h-6" />
                              </button>
                              <Avatar className="w-10 h-10 border border-white/20 shadow-sm">
                                  <AvatarImage src={avatarUrl} crossOrigin="anonymous" className="object-cover" />
                                  <AvatarFallback className="bg-emerald-600 text-white text-xs">
                                      {currentStory.user.fullName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col justify-center">
                                  <p className="text-white font-semibold text-[15px] leading-tight">
                                      {currentStory.user.fullName}
                                  </p>
                                  <p className="text-white/70 text-[12px]">{formatTime(currentStory.createdAt)}</p>
                              </div>
                          </div>
                          <button
                              onClick={onClose}
                              className="p-2 text-white/80 hover:text-white transition-colors outline-none"
                          >
                              <X className="w-6 h-6" />
                          </button>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a]">
                          {videoUrl ? (
                              <video
                                  key={videoUrl} // Penting agar video reset saat ganti story
                                  src={videoUrl}
                                  className="w-full h-auto max-h-full object-contain"
                                  autoPlay
                                  onEnded={handleNext}
                                  playsInline
                                  crossOrigin="anonymous"
                              />
                          ) : (
                              <Image
                                  fill
                                  src={imageUrl || ""}
                                  className="object-contain"
                                  alt="Story Content"
                                  crossOrigin="anonymous"
                                  priority
                                  unoptimized
                              />
                          )}

                          {/* Navigation Tap Areas (WhatsApp Style) */}
                          <div className="absolute inset-0 flex z-30">
                              <div className="w-[30%] h-full cursor-pointer" onClick={handlePrev} />
                              <div className="w-[70%] h-full cursor-pointer" onClick={handleNext} />
                          </div>

                          {/* Caption area (WhatsApp Style: Bottom overlay) */}
                          {currentStory.caption && (
                              <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 text-center z-40 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                                  <p className="text-white text-[15px] leading-relaxed max-w-[90%] mx-auto drop-shadow-md">
                                      {currentStory.caption}
                                  </p>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Desktop Side Buttons */}
                  <div className="hidden md:contents">
                      <button
                          onClick={handlePrev}
                          disabled={currentIndex === 0}
                          className={cn(
                              "absolute left-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-50",
                              currentIndex === 0 && "opacity-0 pointer-events-none",
                          )}
                      >
                          <ChevronLeft className="w-8 h-8" />
                      </button>
                      <button
                          onClick={handleNext}
                          className="absolute right-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all z-50"
                      >
                          <ChevronRight className="w-8 h-8" />
                      </button>
                  </div>
              </div>,
              document.body,
          )
        : null;
};
