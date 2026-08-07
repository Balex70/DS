"use client";

import { Link } from "@/i18n/navigation";
import { ChevronRight, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl'

import { useCategories } from "@/hooks/use-categories";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";

export function MegaMenu() {
    const { data: categories, isLoading } = useCategories();
    const [open, setOpen] = useState(false);
    const t = useTranslations('frontend')
    const locale = useLocale();

    // Root categories
    const rootCategories = useMemo(() =>
        categories?.filter(
            (category) =>
                !category.parent_id &&
                category.active
        ) ?? [],
        [categories]
    )

    // Active root category
    const [selectedRootId, setSelectedRootId] = useState<number | null>(null);

    // Set initial active category
    const activeRootId = selectedRootId ?? rootCategories[0]?.id ?? null;

    // Active root object
    const activeRoot = rootCategories.find(
        (category) => category.id === activeRootId
    );

    // Second level
    const secondLevelCategories =
        categories?.filter(
            (category) =>
                category.parent_id === activeRoot?.id &&
                category.active
        ) ?? [];

    if (isLoading) {
        return (
            <Button
                variant="outline"
                className="gap-2"
            >
                <LayoutGrid className="h-4 w-4" />
                {t('header.catalog')}
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2"
                >
                    <LayoutGrid className="h-4 w-4" />
                    {t('header.catalog')}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[950px] p-0"
            >
                <div className="flex h-[600px]">
                    {/* LEFT SIDE */}
                    <div className="w-64 border-r bg-muted/30">
                        <ScrollArea className="h-full">
                            <div className="p-2">
                                {rootCategories.map((category) => {
                                    const isActive = category.id === activeRootId;
                                    const translation = category?.translations.find((item) => item.locale === locale);

                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.full_path}`}
                                            onMouseEnter={() => setSelectedRootId(category.id)}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition",
                                                isActive
                                                    ? "bg-background font-medium shadow-sm"
                                                    : "hover:bg-background"
                                            )}
                                        >
                                            <span className="truncate">{translation?.name ?? category.name}</span>

                                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1">
                        <ScrollArea className="h-full">
                            <div className="p-4">
                                <div className="columns-3 gap-6 space-y-0">
                                    {secondLevelCategories.map((second) => {
                                        const thirdLevelCategories =
                                            categories?.filter(
                                                (c) => c.parent_id === second.id && c.active
                                            ) ?? [];
                                        const secondTranslation = second?.translations.find((item) => item.locale === locale);

                                        return (
                                            <div
                                                key={second.id}
                                                className="mb-6 break-inside-avoid"
                                            >
                                                {/* SECOND LEVEL */}
                                                <Link
                                                    href={`/category/${second.full_path}`}
                                                    onClick={() => setOpen(false)}
                                                    className="block font-semibold text-sm mb-2 hover:underline"
                                                >
                                                    {secondTranslation?.name ?? second.name}
                                                </Link>

                                                {/* THIRD LEVEL */}
                                                <div className="space-y-1">
                                                    {thirdLevelCategories.map((third) => {
                                                        const thirdTranslation = third?.translations.find((item) => item.locale === locale);
                                                        return (
                                                            <Link
                                                                key={third.id}
                                                                href={`/category/${third.full_path}`}
                                                                onClick={() => setOpen(false)}
                                                                className="block text-sm text-muted-foreground hover:text-foreground"
                                                            >
                                                                {thirdTranslation?.name ?? third.name}
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
