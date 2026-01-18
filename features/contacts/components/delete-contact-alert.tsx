"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteContactAlertProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export function DeleteContactAlert({ isOpen, onClose, onConfirm, isDeleting }: DeleteContactAlertProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white dark:bg-[#181a20] border-slate-200 dark:border-white/10">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-800 dark:text-slate-100">Hapus Kontak?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                        Apakah Anda yakin ingin menghapus kontak ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-200"
                    >
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
