import { SearchComponent } from "@/components/frontend/search/search-component";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { cookies } from "next/headers";

type Props = {
    searchParams: Promise<{
        q?: string;
    }>;
    params: Promise<{
        locale: string;
    }>;
};

const DEFAULT_CURRENCY: CurrencyCode = "USD";
function getCurrency(value: string | undefined): CurrencyCode {
    return value && value in CURRENCIES
        ? (value as CurrencyCode)
        : DEFAULT_CURRENCY;
}

export default async function SearchPage({searchParams, params}: Props) {
    const [{ q }, { locale }] = await Promise.all([
        searchParams,
        params,
    ]);
    const cookieStore = await cookies();
    const currency = getCurrency(cookieStore.get("currency")?.value);

    return (
        <div className="container mx-auto px-4 py-6">
            <SearchComponent q={q} locale={locale} currency={currency} />
        </div>
    );
}
