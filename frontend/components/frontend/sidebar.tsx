import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Automotive",
    "Sports",
];

export function Sidebar() {
    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
                <h2 className="font-semibold">
                    Categories
                </h2>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-muted"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
