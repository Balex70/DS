import { Category } from "@/types/category";
import { getLocale } from "next-intl/server";

type Props = {
    category?: Category;
};

export async function CategoryHeaderSection({
    category
}: Props) {
    const locale = await getLocale();
    const translation = category?.translations.find((item) => item.locale === locale);

    return (
        <div className="space-y-2">
            <h1 className="text-md md:text-lg font-semibold">{(translation?.name != undefined && translation?.name != '') ? translation?.name : category?.name}</h1>
        </div>
    );
}
