import HomeView from "@/features/home/views/home-view";
import { JwtPayload } from "@/interfaces/jwt-payload";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || "";

    let currentUserId = "";
    try {
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            currentUserId = decoded.sub;
        }
    } catch (error) {
        console.error("Gagal decode token:", error);
    }

    return <HomeView token={token} currentUserId={currentUserId} />;
}
