import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";


export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <div className="space-y-6">
            {/* Header / Category Info */}
            <CategoryHeaderSection slug={slug} />

            <Separator />

            {/* Subcategories */}
            <SubcategoriesSection slug={slug} />

            <Separator />

            {/* Products */}
            <section className="space-y-3">
                <h2 className="text-lg font-medium">Products</h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {/* Placeholder product cards */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Card
                            key={i}
                            className="overflow-hidden transition hover:shadow-md"
                        >
                            <div className="aspect-square bg-muted" />

                            <CardContent className="p-3 space-y-2">
                                <div className="h-4 w-5/6 rounded bg-muted" />
                                <div className="h-3 w-2/3 rounded bg-muted" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
