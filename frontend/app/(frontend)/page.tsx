export default function HomePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Categories
                </h1>

                <p className="text-muted-foreground">
                    Browse our product categories
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-xl border bg-card p-6"
                    >
                        <div className="aspect-square rounded-lg bg-muted" />

                        <div className="mt-4">
                            <h3 className="font-medium">
                                Category {index + 1}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
