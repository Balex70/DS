import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            {/* Sidebar */}
            <aside className="hidden w-72 shrink-0 lg:block">
                <div className="space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-3">
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-7 w-full" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-7 w-full" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-7 w-full" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1">
                <div className="space-y-3 lg:space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-9 w-2/3 max-w-md" />
                        <Skeleton className="h-4 w-full max-w-2xl" />
                        <Skeleton className="h-4 w-4/5 max-w-xl" />
                    </div>
                    <div className="py-1">
                        <Skeleton className="h-px w-full" />
                    </div>
                    <div className="space-y-3 pt-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full max-w-3xl" />
                        <Skeleton className="h-4 w-5/6 max-w-2xl" />
                    </div>
                    <div className="flex gap-3 overflow-hidden">
                        <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                        <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                        <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                        <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                        <Skeleton className="h-42 w-42 shrink-0 rounded-lg" />
                    </div>
                </div>
            </main>
        </>
    );
}
