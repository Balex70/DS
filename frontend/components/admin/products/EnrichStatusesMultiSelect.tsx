"use client";

import * as React from "react";
import { BadgeX, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
    value: string[];
    onChange: (value: string[]) => void;
};

function buildTree() {
    return [
        'enriched',
        'outdated',
        'failed'
    ];
}

function TreeItem({
    node,
    value,
    onToggle,
}: {
    node: string;
    value: string[];
    onToggle: (id: string) => void;    
}) {
    const isSelected = value.includes(node);

    return (
        <div>
            <div
                className="flex items-center gap-2 py-1"
                onClick={() => onToggle(node)}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(node)}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    readOnly
                />
                <span className="text-sm">{node}</span>
            </div>
        </div>
    );
}

export function EnrichStatusesMultiSelect({
    value = [],
    onChange
}: Props) {
    const [open, setOpen] = React.useState(false);

    const tree = buildTree();
    const toggle = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter(v => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                    >
                        {value.length > 0
                            ? `${value.length} enrich statuses selected`
                            : "Select enrich statuses"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] p-2 max-h-[400px] overflow-auto"
                >
                    {tree.map(node => (
                        <TreeItem
                            key={node}
                            node={node}
                            value={value}
                            onToggle={toggle}
                        />
                    ))}
                </PopoverContent>
            </Popover>

            {/* selected badges */}
            <div className="flex flex-wrap gap-2 mt-2">
                {tree
                    .filter(o => value.includes(o))
                    .map(o => (
                        <Badge
                            key={o}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggle(o)}
                        >
                            {o} <BadgeX data-icon="inline-start" />
                        </Badge>
                    ))}
            </div>
        </div>
    );
}
