export const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30">
            {count}
        </span>
    ) : null;
