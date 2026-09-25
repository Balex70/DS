'use client';

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Category } from "@/types/category";
import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface Props {
    root: Category;
    categories: Category[];
    onBack: () => void;
    onClose: () => void
}

export function MobileSubcategoryGrid({
    root,
    categories,
    onBack,
    onClose
}: Props) {
    const locale = useLocale();
    const rootTranslation = root?.translations.find((item) => item.locale === locale);
    const t = useTranslations('frontend');

    const secondLevel = categories.filter(
        (category) =>
            category.parent_id === root.id &&
            category.is_visible
    );

    const getChildren = (parentId: number) =>
        categories.filter(
            (category) =>
                category.parent_id === parentId &&
                category.is_visible
        );

    return (
        <div className="flex h-full flex-col min-h-0">
            <button
                onClick={onBack}
                className="border-b p-4 pl-1 pt-1 text-left font-medium"
            >
                <span className="inline-flex items-center"><ChevronLeft className="mr-1 h-4 w-4" />{t('megamenu.back')}</span>
            </button>

            <Link
                href={`/category/${root.full_path}`}
                onClick={onClose}
                className="flex items-center justify-between border-b bg-muted/40 p-4 font-semibold"
            >
                <span className="inline-flex items-center">{rootTranslation?.name ?? root.name}<ChevronsRight className="ml-2 !h-5 !w-5" /></span>
            </Link>

            <div className="min-h-0 flex-1 overflow-y-auto">
                <Accordion
                    type="multiple"
                    className="w-full"
                >
                    {secondLevel.length > 0 && secondLevel.map((second) => {
                        const secondTranslation =
                            second.translations.find(
                                (item) => item.locale === locale
                            );
                        const secondTitle = (secondTranslation?.name !== undefined && secondTranslation?.name !== '' ) ? secondTranslation?.name : second.name;

                        const thirdLevel = getChildren(second.id);

                        if (thirdLevel.length === 0) {
                            return (
                                <Link
                                    key={second.id}
                                    href={`/category/${second.full_path}`}
                                    className="flex h-12 items-center border-b px-6 text-sm font-medium hover:bg-muted"
                                    onClick={onClose}
                                >
                                    {secondTitle}<ChevronRight className="ml-2 !h-3 !w-3" />
                                </Link>
                            );
                        }

                        return (
                            <AccordionItem
                                key={second.id}
                                value={String(second.id)}
                            >
                                <AccordionTrigger className="px-6">
                                    {secondTitle}
                                </AccordionTrigger>

                                <AccordionContent className="pb-0">
                                    <div className="flex flex-col">
                                        {thirdLevel.map((third) => {
                                            const thirdTranslation =
                                                third.translations.find(
                                                    (item) => item.locale === locale
                                                );

                                            return (
                                                <Link
                                                    key={third.id}
                                                    href={`/category/${third.full_path}`}
                                                    className="px-8 py-3 text-sm text-muted-foreground hover:bg-muted"
                                                    onClick={onClose}
                                                >
                                                    {(thirdTranslation?.name !== undefined && thirdTranslation?.name !== '') ? thirdTranslation?.name : third.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <Link
                                        href={`/category/${second.full_path}`}
                                        onClick={onClose}
                                        className="
                                            mt-2
                                            flex
                                            items-center
                                            justify-between
                                            px-8
                                            py-3
                                            font-medium
                                            text-gray-600
                                            font-medium
                                        "
                                    >
                                        <span>
                                            {t('megamenu.browse')} - {secondTitle}
                                        </span>

                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}
