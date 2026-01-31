"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Eye, Loader2, MoreVertical, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Story, StoryViewer } from "../interfaces/story";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { deleteStoryAction } from "../application/actions/delete-story-action";
import { getStoryViewers } from "../application/queries/get-story-viewers-query";

export interface StoryViewerProps {
    stories: Story[];
    initialIndex: number;
    onClose: () => void;
    onStoryDeleted?: (storyId: string) => void;
}

export const MyStoryViewerModal = ({ stories, initialIndex, onClose, onStoryDeleted }: StoryViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [viewers, setViewers] = useState<StoryViewer[]>([]);
    const [isLoadingViewers, setIsLoadingViewers] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [localStories, setLocalStories] = useState(stories);
    const currentStory = localStories[currentIndex];

    const getFullUrl = (path: string | null) => {
        if (!path) return "";
        const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        return `${baseUrl}/api/public${cleanPath}`;
    };

    const imageUrl = currentStory ? getFullUrl(currentStory.imageUrl) : "";
    const videoUrl = currentStory ? getFullUrl(currentStory.videoUrl) : "";
    const avatarUrl = currentStory ? getFullUrl(currentStory.user.avatarUrl) : "";

    useEffect(() => {
        if (!currentStory) return;

        const fetchViewers = async () => {
            setIsLoadingViewers(true);
            try {
                const response = await getStoryViewers(currentStory.id);
                if (response.success) setViewers(response.data || []);
            } catch (error) {
                console.error("Error fetching viewers:", error);
            } finally {
                setIsLoadingViewers(false);
            }
        };

        fetchViewers();
    }, [currentIndex, currentStory, currentStory.id]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentIndex < localStories.length - 1) {
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

    const handleDelete = async () => {
        if (!currentStory) return;

        const confirmDelete = confirm("Are you sure you want to delete this story?");
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteStoryAction(currentStory.id);
            if (result.status === "success") {
                toast?.success("Story deleted");

                const deletedId = currentStory.id;

                onStoryDeleted?.(deletedId);
                const updatedStories = localStories.filter((s) => s.id !== deletedId);

                if (updatedStories.length === 0) {
                    onClose();
                } else {
                    setLocalStories(updatedStories);
                    if (currentIndex >= updatedStories.length) {
                        setCurrentIndex(updatedStories.length - 1);
                    }
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!currentStory) return null;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const modalContent = (
        <div className="fixed inset-0 z-60 bg-black flex items-center justify-center animate-in fade-in duration-500">
            {imageUrl && (
                <div
                    className="absolute inset-0 opacity-40 bg-center bg-cover blur-[80px] scale-125 transition-all duration-700"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            )}

            <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-[#050505] md:rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 z-10">
                {/* Progress Indicators */}
                <div className="absolute top-0 left-0 right-0 p-3 z-50 flex gap-1.5 pt-4 px-4">
                    {localStories.map((_, idx) => (
                        <div key={idx} className="h-0.75 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full bg-white transition-all duration-300",
                                    idx < currentIndex ? "w-full" : idx === currentIndex ? "w-full" : "w-0",
                                )}
                            />
                        </div>
                    ))}
                </div>

                {/* Header Information */}
                <div className="absolute top-6 left-0 right-0 p-4 z-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/10 ring-1 ring-black/20">
                            <AvatarImage src={avatarUrl} crossOrigin="anonymous" className="object-cover" />
                            <AvatarFallback className="bg-slate-800 text-xs">My Story</AvatarFallback>
                        </Avatar>
                        <div className="drop-shadow-lg">
                            <p className="text-white font-bold text-sm tracking-tight">{currentStory.user.fullName}</p>
                            <p className="text-white/60 text-[10px] font-medium">
                                {formatTime(currentStory.createdAt)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-9 w-9 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-xl border border-white/10 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Media Content Area */}
                <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                    {isDeleting && (
                        <div className="absolute inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}

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
                        <Image
                            fill
                            src={imageUrl || ""}
                            className="object-contain pointer-events-none"
                            alt="Story"
                            crossOrigin="anonymous"
                            priority
                            unoptimized
                        />
                    )}

                    <div className="absolute top-0 left-0 w-1/3 h-[80%] z-20 cursor-pointer" onClick={handlePrev} />
                    <div className="absolute top-0 right-0 w-1/3 h-[80%] z-20 cursor-pointer" onClick={handleNext} />

                    {currentStory.caption && (
                        <div className="absolute bottom-24 left-0 right-0 p-6 text-center z-30">
                            <p className="text-white text-sm ">{currentStory.caption}</p>
                        </div>
                    )}
                </div>

                {/* Footer: Viewer Count & Sheet Trigger */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-50 flex justify-center bg-linear-to-t from-black/90 via-black/40 to-transparent">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="group flex flex-col items-center gap-2 outline-none transition-all active:scale-90"
                            >
                                <ChevronRight className="-rotate-90 w-5 h-5 text-white/50 group-hover:text-white transition-opacity animate-pulse" />
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-2xl px-5 py-2 rounded-full border border-white/20 shadow-2xl group-hover:bg-white/20 transition-all">
                                    <Eye className="w-4 h-4 text-white" />
                                    <span className="text-xs font-bold text-white tracking-wide">
                                        {viewers.length} Viewers
                                    </span>
                                </div>
                            </button>
                        </SheetTrigger>

                        <SheetContent
                            side="bottom"
                            className={cn(
                                "h-[55vh]! flex flex-col rounded-t-[32px] bg-[#0f1115]/95 backdrop-blur-3xl border-white/10 text-white z-100 px-0 pb-0",
                                "mx-auto w-full md:max-w-md border-t shadow-2xl overflow-hidden outline-none",
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 z-10 px-8 pt-7 pb-5 border-b border-white/5 bg-transparent backdrop-blur-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight">Story Views</h3>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            Activity from your followers
                                        </p>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all outline-none border border-white/5 bg-white/5">
                                                <MoreVertical className="w-5 h-5 text-slate-300" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-[#1a1d23] border-white/10 text-white min-w-40 rounded-2xl p-1.5 shadow-2xl z-110"
                                        >
                                            <DropdownMenuItem
                                                disabled={isDeleting}
                                                onClick={handleDelete}
                                                className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-400/10 rounded-xl py-2.5 cursor-pointer transition-colors"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                                <span className="font-semibold text-sm">Delete Story</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 w-full h-[calc(55vh-100px)]">
                                <div className="px-5 pt-4 pb-12">
                                    {isLoadingViewers ? (
                                        <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-50">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                                                Loading Views
                                            </span>
                                        </div>
                                    ) : viewers.length > 0 ? (
                                        <div className="space-y-1">
                                            {viewers.map((viewer, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="w-11 h-11 border border-white/10 shadow-md">
                                                            <AvatarImage
                                                                src={getFullUrl(viewer.user.avatarUrl)}
                                                                crossOrigin="anonymous"
                                                                className="object-cover"
                                                            />
                                                            <AvatarFallback className="bg-indigo-600 text-xs text-white">
                                                                {viewer.user.fullName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
                                                                {viewer.user.fullName}
                                                            </span>
                                                            <span className="text-[11px] text-slate-500 font-medium leading-none">
                                                                @{viewer.user.username}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                        {formatTime(viewer.seenAt)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                                                <Eye className="w-7 h-7 text-slate-600 opacity-40" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">No viewers yet</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Desktop Navigation */}
            <button
                onClick={handlePrev}
                className={cn(
                    "hidden md:flex absolute left-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 transition-all",
                    currentIndex === 0 && "opacity-0 pointer-events-none",
                )}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={handleNext}
                className={cn(
                    "hidden md:flex absolute right-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 transition-all",
                    currentIndex === localStories.length - 1 && "opacity-0 pointer-events-none",
                )}
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );

    return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
};
