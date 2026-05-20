import { Header } from "@/components/frontend/header";
import { Sidebar } from "@/components/frontend/sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto flex gap-6 px-4 py-6">
                <aside className="hidden w-72 shrink-0 lg:block">
                    <Sidebar />
                </aside>

                <main className="min-w-0 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
