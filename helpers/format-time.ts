export const formatTime = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const now = new Date();

    if (isNaN(date.getTime())) return "";

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    return isToday
        ? date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};
