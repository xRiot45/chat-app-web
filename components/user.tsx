import { Avatar } from "./avatar";

export default function User() {
    return (
        <div className="flex items-center gap-3">
            <Avatar
                src="https://i.pravatar.cc/150?u=me"
                className="w-10 h-10 ring-2 ring-indigo-500/50"
                status="online"
            />
            <div>
                <h1 className="font-bold text-lg leading-tight">Thomas Alberto</h1>
                <p className="text-xs text-slate-500 font-medium">Sedang Istirahat</p>
            </div>
        </div>
    );
}
