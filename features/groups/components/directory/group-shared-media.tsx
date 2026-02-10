import { ChevronRight, Download, FileText, ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { SharedMediaItem } from "../../interfaces/group";

interface GroupSharedMediaProps {
    mediaItems: SharedMediaItem[];
}

export const GroupSharedMedia: React.FC<GroupSharedMediaProps> = ({ mediaItems }) => {
    // Memisahkan data berdasarkan tipe
    const images = mediaItems.filter((item) => item.type === "image");
    const files = mediaItems.filter((item) => item.type === "file");

    return (
        <div className="space-y-8">
            {/* --- Photos Section --- */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Shared Media
                    </h4>
                    <button className="text-indigo-500 text-xs hover:underline font-medium flex items-center gap-0.5">
                        View All <ChevronRight className="w-3 h-3" />
                    </button>
                </div>

                {images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {images.slice(0, 6).map((media) => (
                            <MediaThumbnail key={media.id} media={media} />
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No media shared yet" />
                )}
            </section>

            {/* --- Documents Section --- */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Documents
                    </h4>
                </div>

                <div className="space-y-2.5">
                    {files.length > 0 ? (
                        files.slice(0, 3).map((file) => <FileItem key={file.id} file={file} />)
                    ) : (
                        <EmptyState message="No documents found" />
                    )}
                </div>
            </section>
        </div>
    );
};

/** * Sub-component: Thumbnail Gambar
 */
const MediaThumbnail: React.FC<{ media: SharedMediaItem }> = ({ media }) => (
    <div className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
        <Image
            src={media.src || ""}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt="Shared media"
            width={200}
            height={200}
            crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Search className="w-5 h-5 text-white opacity-70" />
        </div>
    </div>
);

/** * Sub-component: Baris File/Dokumen
 */
const FileItem: React.FC<{ file: SharedMediaItem }> = ({ file }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200 transition-colors">
                {file.name}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">{file.size} • PDF</p>
        </div>
        <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Download file"
        >
            <Download className="w-4 h-4" />
        </button>
    </div>
);

/** * Sub-component: Empty State sederhana
 */
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="py-6 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center">
        <p className="text-[11px] text-slate-400 font-medium italic">{message}</p>
    </div>
);

// Note: Tambahkan Search dari lucide-react jika belum diimport
import { Search } from "lucide-react";
