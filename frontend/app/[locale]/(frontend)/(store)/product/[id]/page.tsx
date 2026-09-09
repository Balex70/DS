import { getProduct } from "@/actions/productActions";
import { BackButton } from "@/components/frontend/product/BackButton";
import { ProductDetail } from "@/components/frontend/product/product-detail";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { Metadata } from "next";
import { cookies } from "next/headers";

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

const DEFAULT_CURRENCY: CurrencyCode = "USD";

function getCurrency(value: string | undefined): CurrencyCode {
    return value && value in CURRENCIES
        ? (value as CurrencyCode)
        : DEFAULT_CURRENCY;
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}) {
    const { id, locale } = await params;

    const cookieStore = await cookies();
    const currency = getCurrency(cookieStore.get("currency")?.value);

    const product = await getProduct(id, currency);
    const translation = product.translations?.find(
            (item) => item.locale === locale
        );

    return (
        <div className="container mx-auto pb-12">
            <BackButton />
            <ProductDetail productId={id} />

            {/* DESCRIPTION (if you have it) */}
            {product.description_processed && (
                <div className="full-width prose max-w-none text-sm text-muted-foreground">
                    {translation?.description ?? product.description_processed ?? product.description_raw}
                </div>
            )}
        </div>
    );
}
