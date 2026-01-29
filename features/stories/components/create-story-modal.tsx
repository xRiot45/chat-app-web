"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CloudUpload, Send, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";

interface CreateStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    isUploading?: boolean;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isUploading = false,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setCaption("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUpload = () => {
        if (!file) return;
        const formData = new FormData();
        formData.append(file.type.startsWith("video") ? "video" : "image", file);
        formData.append("caption", caption);
        onSubmit(formData);
    };

    const isVideo = file?.type.startsWith("video");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-none bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-lg font-semibold tracking-tight">New Story</DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-4">
                    {/* Compact Preview Area */}
                    <div className="relative">
                        <div
                            onClick={() => !previewUrl && fileInputRef.current?.click()}
                            className={cn(
                                "relative rounded-2xl overflow-hidden transition-all duration-300",
                                !previewUrl &&
                                    "border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer",
                            )}
                        >
                            <AspectRatio
                                ratio={previewUrl ? 4 / 5 : 16 / 9}
                                className="flex flex-col items-center justify-center"
                            >
                                {previewUrl ? (
                                    <div className="group relative w-full h-full">
                                        {isVideo ? (
                                            <video
                                                src={previewUrl}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                loop
                                                muted
                                            />
                                        ) : (
                                            <Image
                                                height={100}
                                                width={100}
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8 rounded-full shadow-xl"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveFile();
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                                            <CloudUpload className="h-6 w-6 text-slate-500" />
                                        </div>
                                        <span className="text-xs font-medium">Select photo or video</span>
                                    </div>
                                )}
                            </AspectRatio>
                        </div>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-1.5">
                        <Label htmlFor="caption" className="text-[11px] uppercase tracking-wider text-slate-500 ml-1">
                            Caption
                        </Label>
                        <Input
                            id="caption"
                            placeholder="Write a message..."
                            value={caption}
                            autoComplete="off"
                            onChange={(e) => setCaption(e.target.value)}
                            className="bg-slate-100/50 dark:bg-slate-900/50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500 h-10 rounded-xl text-sm"
                        />
                    </div>

                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        disabled={!file || isUploading}
                        onClick={handleUpload}
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Uploading...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                Share to Stories
                            </span>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
