import { SearchComponent } from "@/components/frontend/search/search-component";
import { CURRENCIES, CurrencyCode } from "@/types/currency";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { getSettings } from "@/actions/settingsActions";

type Props = {
    searchParams: Promise<{
        q?: string;
    }>;
    params: Promise<{
        locale: string;
    }>;
};

export async function generateMetadata({
    params,
}: Pick<Props, "params">): Promise<Metadata> {
    const { locale } = await params;
    const settings = await getSettings();
    const t = await getTranslations({ locale, namespace: "frontend" });

    const storeName = (settings?.["store.name"] && settings?.["store.name"] !== '') ? ' | ' + settings?.["store.name"] : '';

    return {
        title: t("search.meta.title") + storeName,
        description: t("search.meta.description"),
        robots: {
            index: false,
            follow: true,
        },
    };
}

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
