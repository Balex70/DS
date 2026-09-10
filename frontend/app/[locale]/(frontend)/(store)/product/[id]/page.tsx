import { getProduct } from "@/actions/productActions";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
        locale: string;
    }>;
};

const DEFAULT_CURRENCY: CurrencyCode = "USD";

function getCurrency(value: string | undefined): CurrencyCode {
    return value && value in CURRENCIES
        ? (value as CurrencyCode)
        : DEFAULT_CURRENCY;
}

export default async function ProductPage({
    params,
}: Props) {
    const { id, locale } = await params;

    const cookieStore = await cookies();
    const currency = getCurrency(cookieStore.get("currency")?.value);

    const product = await getProduct(id, currency);
    if (!product) {
        notFound();
    }

    const selectedVariant = product?.variants?.[0];
    if (!selectedVariant) {
        notFound();
    }

    redirect(
        `/${locale}/product/${id}/${selectedVariant.external_id}`
    );
}
