import { getProduct } from "@/actions/productActions";
import { BackButton } from "@/components/frontend/product/BackButton";
import { ProductDetail } from "@/components/frontend/product/product-detail";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DOMPurify from "isomorphic-dompurify";

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const canonicalUrl = `${siteUrl}/${locale}/product/${id}/${variant}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
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
    const t = await getTranslations('frontend');
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

    const description = DOMPurify.sanitize(translation?.description ?? product.description_processed ?? product.description_raw, {
        USE_PROFILES: {
            html: true,
        },
    });

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
                <>
                    <h2 className="mb-4 text-lg font-semibold sm:text-xl">{t('product.description_label')}</h2>
                    <div
                        className="
                            prose
                            prose-sm
                            sm:prose-base
                            max-w-none
                            prose-p:my-4
                            prose-p:leading-7
                            prose-h2:mb-4
                        "
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                </>
            )}
        </div>
    );
}
