import { Category } from "@/types/category";
import { getLocale } from "next-intl/server";
import DOMPurify from "isomorphic-dompurify";

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

    const cleanHtml = DOMPurify.sanitize(translation?.description ?? category.description, {
        USE_PROFILES: {
            html: true,
        },
    });

    return (
        <div className="space-y-2">
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
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
        </div>
    );
}
