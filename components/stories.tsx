import { STORIES } from "@/constants/stories";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";

export default function Stories({ openStory }: { openStory: (index: number) => void }) {
    return (
        <div className="pl-5 pb-4 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max pr-5">
                {STORIES.map((story, idx) => (
                    <div
                        key={story.id}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        onClick={() => openStory(idx)}
                    >
                        <div
                            className={cn(
                                "p-0.5 rounded-full",
                                story.viewed
                                    ? "bg-slate-300 dark:bg-white/10"
                                    : "bg-linear-to-tr from-yellow-400 via-pink-500 to-indigo-500",
                            )}
                        >
                            <div className="p-0.5 bg-white dark:bg-[#0f1115] rounded-full">
                                <Avatar src={story.img} className="w-14 h-14" />
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
                            {story.isMe ? "Cerita Anda" : story.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
