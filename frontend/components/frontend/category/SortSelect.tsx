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

type Props = {
    value: SortSelectValue;
    onChange: (value: SortSelectValue) => void;
};

export function SortSelect({ value, onChange }: Props) {
    return (
        <div className="flex justify-end">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[200px] flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                     <span className="ml-auto">
                        <SelectValue placeholder="Sort" />
                    </span>
                </SelectTrigger>

                <SelectContent position="popper" className="w-[200px]">
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="price_asc">Price: Low → High</SelectItem>
                    <SelectItem value="price_desc">Price: High → Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
