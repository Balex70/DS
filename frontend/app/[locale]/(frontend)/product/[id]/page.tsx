import { ProductDetail } from "@/components/frontend/product/product-detail";

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    return (
        <div className="container mx-auto px-4 py-6">
            <ProductDetail productId={id} />
        </div>
    );
}
