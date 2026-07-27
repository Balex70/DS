import { ProductDetail } from "@/components/frontend/product/product-detail";

export default async function ProductPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    return (
        <div className="container mx-auto pb-12">
            <ProductDetail productId={id} />
        </div>
    );
}
