import { Header } from "@/components/frontend/header";
import { QueryProvider } from "@/providers/query-provider";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryProvider>
            <div className="min-h-screen bg-background">
                <Header />

                <div className="container mx-auto px-4 py-6">
                    {children}
                </div>
            </div>
        </QueryProvider>
    );
}
