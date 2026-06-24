import { CategoryComponent } from "@/components/frontend/category/category-component";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const { slug } = await params;

    return (
        <CategoryComponent slug={slug} />
    );
}
