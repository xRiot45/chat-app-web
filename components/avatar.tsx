import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
    src: string;
    className?: string;
    status?: "online" | "busy" | "offline";
    onClick?: () => void;
}

export const Avatar = ({ src, className, status, onClick }: AvatarProps) => (
    <div className="relative inline-block" onClick={onClick}>
        <div
            className={cn(
                "relative flex shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-sm",
                className,
            )}
        >
            <Image
                height={500}
                width={500}
                className="aspect-square h-full w-full object-cover"
                src={src}
                alt="Avatar"
            />
        </div>
        {status && (
            <span
                className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900",
                    status === "online" ? "bg-green-500" : status === "busy" ? "bg-red-500" : "bg-slate-400",
                )}
            ></span>
        )}
    </div>
);
