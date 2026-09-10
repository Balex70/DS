import { getProduct } from "@/actions/productActions";
import { BackButton } from "@/components/frontend/product/BackButton";
import { ProductDetail } from "@/components/frontend/product/product-detail";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
        variant: string;
        locale: string;
    }>;
};

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { id, variant, locale } = await params;
    
    const product = await getProduct(id);
    if (!product) {
        notFound();
    }

    const translation = product.translations?.find(
        (item) => item.locale === locale
    );
    
    const selectedVariant = product.variants?.find(
        v => v.external_id.toString() === variant
    );
    if (!selectedVariant) {
        notFound();
    }

    const variantTranslation = selectedVariant?.translations.find((item) => item.locale === locale);
    const title = variantTranslation?.name ?? selectedVariant.name_processed ?? selectedVariant.name ?? product.name_processed ?? product.name_raw;

    const description = translation?.description ?? product.description_processed ?? product.description_raw ?? "";

    return {
        title,
        description,
    };
}

const DEFAULT_CURRENCY: CurrencyCode = "USD";

function getCurrency(value: string | undefined): CurrencyCode {
    return value && value in CURRENCIES
        ? (value as CurrencyCode)
        : DEFAULT_CURRENCY;
}

export default async function ProductPage({
    params,
}: Props) {
    const { id, variant, locale } = await params;

    const cookieStore = await cookies();
    const currency = getCurrency(cookieStore.get("currency")?.value);

    const product = await getProduct(id, currency);
    if (!product) {
        notFound();
    }
    
    const selectedVariant = product.variants?.find(
        v => v.external_id.toString() === variant
    );
    if (!selectedVariant) {
        notFound();
    }

    const translation = product.translations?.find(
            (item) => item.locale === locale
        );

    return (
        <div className="container mx-auto pb-12">
            <BackButton />
            <ProductDetail
                product={product}
                selectedVariant={selectedVariant}
                currency={currency}
                />

            {/* DESCRIPTION (if you have it) */}
            {product.description_processed && (
                <div className="full-width prose max-w-none text-sm text-muted-foreground">
                    {translation?.description ?? product.description_processed ?? product.description_raw}
                </div>
            )}
        </div>
    );
}
