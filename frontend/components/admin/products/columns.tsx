"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Product } from "@/types/product"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}): ColumnDef<Product>[] => [
  {
    accessorKey: "name_raw",
    header: "Name Raw",
    cell: ({ getValue }) => {
      const value = String(getValue())

      return (
        <div className="max-w-[150px] truncate">
          <span title={value}>{value}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "name_processed",
    header: "Name Processed",
    cell: ({ getValue }) => {
      const value = String(getValue())

      return (
        <div className="max-w-[150px] truncate">
          <span title={value}>{value}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "now_price",
    header: "Now price",
  },
  {
    accessorKey: "is_collect",
    header: "Is collect",
  },
  {
    accessorKey: "add_mark_status",
    header: "Shipping included (add_mark_status)",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.name_raw)}
              >
                Copy name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(product)}>
                View product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product)}>
                Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
