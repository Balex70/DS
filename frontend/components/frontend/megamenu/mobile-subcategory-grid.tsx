'use client';

import Link from "next/link";
import { useLocale } from "next-intl";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { Category } from "@/types/category";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    root: Category;
    categories: Category[];
    onBack: () => void;
}

export function MobileSubcategoryGrid({
    root,
    categories,
    onBack,
}: Props) {
    const locale = useLocale();
    const rootTranslation = root?.translations.find((item) => item.locale === locale);

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
        <div className="flex h-full flex-col">
            <button
                onClick={onBack}
                className="border-b p-4 text-left font-medium"
            >
                <span className="inline-flex items-center"><ChevronLeft className="mr-2 h-4 w-4" /> {rootTranslation?.name ?? root.name}</span>
            </button>

            <Accordion
                type="multiple"
                className="w-full"
            >
                {secondLevel.length > 0 && secondLevel.map((second) => {
                    const secondTranslation =
                        second.translations.find(
                            (item) => item.locale === locale
                        );

                    const thirdLevel = getChildren(second.id);
                    
                    if (thirdLevel.length === 0) {
                        return (
                            <Link
                                key={second.id}
                                href={`/category/${second.full_path}`}
                                className="flex h-12 items-center border-b px-4 text-sm font-medium hover:bg-muted"
                            >
                                {secondTranslation?.name ?? second.name}
                            </Link>
                        );
                    }

                    return (
                        <AccordionItem
                            key={second.id}
                            value={String(second.id)}
                        >
                            <AccordionTrigger className="px-4">
                                {secondTranslation?.name ?? second.name}
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
                                            >
                                                {thirdTranslation?.name ?? third.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Link
                                    href={`/category/${second.full_path}`}
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
                                        Browse - {secondTranslation?.name ?? second.name}
                                    </span>

                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
