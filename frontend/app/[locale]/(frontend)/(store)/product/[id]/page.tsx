import { getProduct } from "@/actions/productActions";
import { ProductDetail } from "@/components/frontend/product/product-detail";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        id: string;
        locale: string;
    }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { id, locale } = await params;

    try {
        const product = await getProduct(id);

        const translation = product.translations?.find(
            (item) => item.locale === locale
        );

        const title = translation?.name ?? product.name_processed ?? product.name_raw;
        const description = translation?.description ?? product.description_processed ?? product.description_raw ?? "";

        return {
            title,
            description,
        };
    } catch {
        return {
            title: "Product",
        };
    }
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;
    return (
        <div className="container mx-auto pb-12">
            <ProductDetail productId={id} />
        </div>
    );
}
