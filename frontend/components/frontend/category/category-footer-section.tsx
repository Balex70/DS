import { Category } from "@/types/category";
import { getLocale } from "next-intl/server";

type Props = {
    category?: Category;
};

export async function CategoryFooterSection({
    category,
}: Props) {
    const locale = await getLocale();
    const translation = category?.translations.find((item) => item.locale === locale);

    if (!category) {
        return;
    }

    return (
        <div className="space-y-2">
            <p className="text-md text-muted-foreground">
                {translation?.description ?? category.description}
            </p>
        </div>
    );
}
