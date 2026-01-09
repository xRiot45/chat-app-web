export const CompanyLogo = ({ name }: { name: string }) => (
    <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
        <div className="w-6 h-6 rounded bg-slate-200 dark:bg-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-current opacity-50" />
        </div>
        {name}
    </div>
);
