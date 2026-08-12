"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SortSelectValue } from "@/types/category";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
    value: SortSelectValue;
    onChange: (value: SortSelectValue) => void;
};

export function SortSelect({ value, onChange }: Props) {
    const t = useTranslations('frontend')
    return (
        <div className="flex justify-end">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-auto min-w-[200px] max-w-[300px]">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                     <span className="ml-2">
                        <SelectValue placeholder={t('category.sort.header')} />
                    </span>
                </SelectTrigger>

                <SelectContent position="popper" className="min-w-[200px] max-w-[300px]">
                    <SelectItem value="latest">{t('category.sort.latest')}</SelectItem>
                    <SelectItem value="price_asc">{t('category.sort.price_asc')}</SelectItem>
                    <SelectItem value="price_desc">{t('category.sort.price_desc')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
