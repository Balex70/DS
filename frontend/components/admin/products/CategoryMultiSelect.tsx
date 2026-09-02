"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/types/category";

type Props = {
    options: Category[]; // must include children
    value: number[];
    onChange: (value: number[]) => void;
};

function buildTree(categories: Category[]) {
    const map: Record<number, Category & { children: Category[] }> = {};
    const roots: (Category & { children: Category[] })[] = [];

    // create nodes
    categories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    // link parents
    categories.forEach(cat => {
        if (cat.parent_id) {
            map[cat.parent_id]?.children.push(map[cat.id]);
        } else {
            roots.push(map[cat.id]);
        }
    });

    return roots;
}

function TreeItem({
    node,
    level = 0,
    value,
    onToggle,
    expanded,
    toggleExpand,
}: {
    node: Category;
    level?: number;
    value: number[];
    onToggle: (id: number) => void;
    expanded: number[];
    toggleExpand: (id: number) => void;
}) {
    const isOpen = expanded.includes(node.id);
    const isSelected = value.includes(node.id);
    const hasChildren = (node.children?.length ?? 0) > 0;

    return (
        <div style={{ paddingLeft: level * 12 }}>
            <div className="flex items-center gap-2 py-1">
                {hasChildren && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpand(node.id);
                        }}
                        className="text-xs w-5"
                    >
                        {isOpen ? "▼" : "▶"}
                    </button>
                )}

                <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggle(node.id);
                    }}
                    readOnly
                />

                <span className="text-sm">{node.name}</span>
            </div>

            {hasChildren && isOpen && (
                <div>
                    {node.children?.map((child: Category) => (
                        <TreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            value={value}
                            onToggle={onToggle}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function flattenTree(categories: Category[]): Category[] {
    const result: Category[] = [];

    function walk(nodes: Category[]) {
        for (const node of nodes) {
            result.push(node);

            if (node.children?.length) {
                walk(node.children);
            }
        }
    }

    walk(categories);

    return result;
}

export function CategoryMultiSelect({ options, value = [], onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState<number[]>([]);

    const tree = React.useMemo(() => {
        return buildTree(options);
    }, [options]);
    const toggle = (id: number) => {
        if (value.includes(id)) {
            onChange(value.filter(v => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    const flatTree = React.useMemo(() => {
        return flattenTree(tree);
    }, [tree]);

    const toggleExpand = (id: number) => {
        setExpanded(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
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
                            ? `${value.length} categories selected`
                            : "Select categories"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] p-2 max-h-[400px] overflow-auto"
                >
                    {tree.map(node => (
                        <TreeItem
                            key={node.id}
                            node={node}
                            value={value}
                            onToggle={toggle}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </PopoverContent>
            </Popover>

            {/* selected badges */}
            <div className="flex flex-wrap gap-2 mt-2">
                {flatTree
                    .filter(o => value.includes(o.id))
                    .map(o => (
                        <Badge
                            key={o.id}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => toggle(o.id)}
                        >
                            {o.name}
                        </Badge>
                    ))}
            </div>
        </div>
    );
}
