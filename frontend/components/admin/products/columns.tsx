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
import { MoreHorizontal, Plus } from "lucide-react"
import { Product } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { PriceRenderer } from "@/components/custom/PriceRenderer"

const FOUR_WEEKS_MS = 1000 * 60 * 60 * 24 * 28

const isFresh = (date?: Date | null) => {
  if (!date) return false
  return Date.now() - new Date(date).getTime() < FOUR_WEEKS_MS
}

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
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "enrich",
    header: "Enrich",
    cell: ({ row }) => {
      const product = row.original

      const enrichedAt = product.last_enrichment_at
      const isFreshEnrichment = isFresh(enrichedAt)

      if (enrichedAt && isFreshEnrichment) {
        return (
          <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-100">
            Enriched
          </Badge>
        )
      }

      if (enrichedAt && !isFreshEnrichment) {
        return (
          <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-100">
            Outdated
          </Badge>
        )
      }

      return (
        <Badge className="bg-red-50 text-yellow-800 hover:bg-yellow-100">
          Fresh
        </Badge>
      )
    },
  },
  {
    id: "ai_texts",
    header: "AI Texts",
    cell: ({ row }) => {
      const product = row.original

      if (product.ai_texts_at) {
        return (
          <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
            <Plus></Plus>
          </Badge>
        )
      }
    },
  },
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
    accessorKey: "cost_price",
    header: "Cost Price",
    cell: ({ getValue }) => {
      const value = Number(getValue())

      return (
        <PriceRenderer value={value} />
      )
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const value = Number(getValue())

      return (
        <PriceRenderer value={value} />
      )
    }
  },
  {
    accessorKey: "ai_status",
    header: "AI Status",
  },
  {
    accessorKey: "warehouse_inventory_num",
    header: "Inventory",
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
