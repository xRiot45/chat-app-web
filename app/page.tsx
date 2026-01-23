import HomeView from "@/features/home/views/home-view";
import { JwtPayload } from "@/interfaces/jwt-payload";
import { jwtDecode } from "jwt-decode";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
    title: "Home - NexusChat",
    description: "Welcome to NexusChat",
};

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || "";

    const decoded = jwtDecode<JwtPayload>(token);
    const currentUserId = decoded.sub;

    return <HomeView token={token} currentUserId={currentUserId} />;
}
