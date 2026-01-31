"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_BASE_URL } from "@/configs/api-base-url";
import { initialActionState } from "@/types/action-state";
import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createStoryAction } from "../application/actions/create-story-action";
import { getStoryFeed } from "../application/queries/get-story-feed-query";
import { showAllMyStories } from "../application/queries/show-all-my-stories-query";
import { CreateStoryModal } from "../components/create-story-modal";
import { MyStoryViewerModal } from "../components/my-story-viewer-modal";
import { StoryFeedModal } from "../components/story-feed-modal";
import { Story } from "../interfaces/story";

export default function StoriesView() {
    const [activeMyStoryIndex, setActiveMyStoryIndex] = useState<number | null>(null);
    const [activeFeedIndex, setActiveFeedIndex] = useState<number | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [stories, setStories] = useState<Story[]>([]);
    const [storyFeeds, setStoryFeeds] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [state, formAction, isPending] = useActionState(createStoryAction, initialActionState);

    // --- Logic Grouping Story Feed Berdasarkan User ---
    const uniqueFeedList = useMemo(() => {
        const grouped = storyFeeds.reduce(
            (acc, story) => {
                const userId = story.user.id;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: story.user,
                        stories: [],
                    };
                }
                acc[userId].stories.push(story);
                return acc;
            },
            {} as Record<string, { user: Story["user"]; stories: Story[] }>,
        );

        return Object.values(grouped);
    }, [storyFeeds]);

    const fetchStories = async () => {
        try {
            setIsLoading(true);
            const response = await showAllMyStories();
            if (response.success === true) {
                setStories(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch stories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStoryFeed = async () => {
        try {
            const response = await getStoryFeed();
            if (response.success === true) {
                setStoryFeeds(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch feed:", error);
        }
    };

    useEffect(() => {
        fetchStories();
        fetchStoryFeed();
    }, []);

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
            setIsCreateModalOpen(false);
            fetchStories();
        } else if (state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);

    const handleOpenMyStory = () => {
        if (stories.length > 0) setActiveMyStoryIndex(0);
    };

    const handleCloseModals = () => {
        setActiveMyStoryIndex(null);
        setActiveFeedIndex(null);
    };

    const currentUser = stories.length > 0 ? stories[0].user : null;

    return (
        <section className="px-5 py-2 shrink-0">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                {/* Tombol Tambah Story */}
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
                        Add Story
                    </span>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center gap-1.5 animate-pulse">
                        <div className="w-15 h-15 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="w-10 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                )}

                {/* My Story (Avatar Kita) */}
                {!isLoading && stories.length > 0 && currentUser && (
                    <button
                        onClick={handleOpenMyStory}
                        className="flex flex-col items-center gap-1.5 shrink-0 outline-none group"
                    >
                        <div className="relative w-15 h-15 rounded-full p-0.5 bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-transform group-hover:scale-110 active:scale-95 duration-300">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f1115] overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <Avatar className="w-full h-full">
                                    <AvatarImage
                                        src={`${API_BASE_URL}/api/public${currentUser?.avatarUrl}`}
                                        className="object-cover"
                                        crossOrigin="anonymous"
                                    />
                                    <AvatarFallback>{currentUser.fullName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium truncate w-14 text-center text-slate-700 dark:text-slate-300">
                            Your Story
                        </span>
                    </button>
                )}

                {/* Story Feed (Avatar Teman - Hasil Grouping) */}
                {!isLoading &&
                    uniqueFeedList.map((group, index) => (
                        <button
                            key={group.user.id}
                            onClick={() => setActiveFeedIndex(index)}
                            className="flex flex-col items-center gap-1.5 shrink-0 outline-none group"
                        >
                            <div className="relative w-15 h-15 rounded-full p-0.5 bg-emerald-500 transition-transform group-hover:scale-110">
                                <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0f1115] overflow-hidden bg-slate-200">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage
                                            src={`${API_BASE_URL}/api/public${group.user.avatarUrl}`}
                                            className="object-cover"
                                            crossOrigin="anonymous"
                                        />
                                        <AvatarFallback>{group.user.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            <span className="text-[10px] font-medium truncate w-14 text-center text-slate-700 dark:text-slate-300">
                                {group.user.fullName.split(" ")[0]}
                            </span>
                        </button>
                    ))}
            </div>

            {/* Viewer untuk Story SAYA */}
            {activeMyStoryIndex !== null && stories.length > 0 && (
                <MyStoryViewerModal
                    stories={stories}
                    initialIndex={activeMyStoryIndex}
                    onClose={handleCloseModals}
                    onStoryDeleted={fetchStories}
                />
            )}

            {/* Viewer untuk FEED TEMAN (Hanya merender story milik user yang diklik) */}
            {activeFeedIndex !== null && uniqueFeedList[activeFeedIndex] && (
                <StoryFeedModal
                    storyFeed={uniqueFeedList[activeFeedIndex].stories}
                    initialIndex={0}
                    onClose={handleCloseModals}
                />
            )}

            {/* Modal Upload */}
            <CreateStoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={formAction}
                isUploading={isPending}
            />
        </section>
    );
}
