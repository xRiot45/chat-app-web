"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STORIES } from "@/constants/stories";
import { useState } from "react";
import { StoryViewerModal } from "../components/story-viewer-modal";

export default function StoriesView() {
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

    const handleOpenStory = (index: number) => {
        setActiveStoryIndex(index);
    };

    const handleCloseStory = () => {
        setActiveStoryIndex(null);
    };

    return (
        <section className="px-5 py-2 shrink-0">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                    <div className="relative w-15 h-15 rounded-full p-0.5 bg-slate-200 dark:bg-white/10 flex items-center justify-center border-2 border-dashed border-slate-400 dark:border-slate-600 group-hover:border-indigo-500 transition-colors">
                        <span className="text-xl text-slate-500 dark:text-slate-400 font-light">+</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">Your Story</span>
                </div>

                {STORIES.map((story, index) => (
                    <button
                        key={story.id || index}
                        onClick={() => handleOpenStory(index)}
                        className="flex flex-col items-center gap-1.5 shrink-0 outline-none group"
                    >
                        <div className="relative w-15 h-15 rounded-full p-0.5 bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform group-hover:scale-105 active:scale-95">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f1115] overflow-hidden">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={story.img} className="object-cover" />
                                    <AvatarFallback>{story.name[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium truncate w-14 text-center text-slate-700 dark:text-slate-300">
                            {story.name.split(" ")[0]}
                        </span>
                    </button>
                ))}
            </div>

            {activeStoryIndex !== null && (
                <StoryViewerModal stories={STORIES} initialIndex={activeStoryIndex} onClose={handleCloseStory} />
            )}
        </section>
    );
}
