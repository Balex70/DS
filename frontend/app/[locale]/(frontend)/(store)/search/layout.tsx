import { Sidebar } from "@/components/frontend/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto flex gap-6 px-4 py-6">
            <aside className="hidden w-72 shrink-0 lg:block">
                <Sidebar />
                {/* TODO: change to sidebar for search page */}
            </aside>

            <main className="min-w-0 flex-1">
                {children}
            </main>
        </div>
    );
}
