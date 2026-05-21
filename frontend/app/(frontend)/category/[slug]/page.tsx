import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubcategoriesSection } from "@/components/frontend/category/subcategories-section";
import { CategoryHeaderSection } from "@/components/frontend/category/category-header-section";
import { ProductsSection } from "@/components/frontend/category/products-section";


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
            <ProductsSection slug={slug} />

        </div>
    );
}
