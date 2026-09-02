"use client";

import { Category } from "@/types/category";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type Props = {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete?: (category: Category) => void;
};

export function CategoryActions({
    category,
    onEdit,
    onDelete,
}: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => onEdit(category)}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>

                {onDelete && (
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(category)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
