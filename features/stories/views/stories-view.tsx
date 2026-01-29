"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STORIES } from "@/constants/stories";
import { useState } from "react";
import { CreateStoryModal } from "../components/create-story-modal"; // Path sesuai folder
import { StoryViewerModal } from "../components/story-viewer-modal";

export default function StoriesView() {
    const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleOpenStory = (index: number) => {
        setActiveStoryIndex(index);
    };

    const handleCloseStory = () => {
        setActiveStoryIndex(null);
    };

    const handleCreateStory = (formData: FormData) => {
        // Logik API Create Story kamu di sini
        console.log("Uploading story data...", formData);
        // Toast atau Notification sukses bisa ditambahkan di sini
    };

    return (
        <section className="px-5 py-2 shrink-0">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {/* Tombol Add Story */}
                <div
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                    <div className="relative w-15 h-15 rounded-full p-0.5 bg-slate-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/5 transition-all">
                        <span className="text-xl text-slate-400 dark:text-slate-500 font-light group-hover:text-indigo-500 group-hover:scale-125 transition-transform">
                            +
                        </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 group-hover:text-indigo-500 transition-colors">
                        Your Story
                    </span>
                </div>

                {/* List Stories */}
                {STORIES.map((story, index) => (
                    <button
                        key={story.id || index}
                        onClick={() => handleOpenStory(index)}
                        className="flex flex-col items-center gap-1.5 shrink-0 outline-none group"
                    >
                        <div className="relative w-15 h-15 rounded-full p-0.5 bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-transform group-hover:scale-110 active:scale-95 duration-300">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f1115] overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={story.img} className="object-cover" />
                                    <AvatarFallback>{story.name[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium truncate w-14 text-center text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 transition-colors">
                            {story.name.split(" ")[0]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Modal Viewer */}
            {activeStoryIndex !== null && (
                <StoryViewerModal stories={STORIES} initialIndex={activeStoryIndex} onClose={handleCloseStory} />
            )}

            {/* Modal Create Story */}
            <CreateStoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateStory}
            />
        </section>
    );
}
