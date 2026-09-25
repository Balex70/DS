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
import { ProductWithCategories } from "@/types/product"
import { Badge } from "@/components/ui/badge"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { Category } from "@/types/category"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const EIGHT_WEEKS_MS = 1000 * 60 * 60 * 24 * 56

const isFresh = (date?: Date | null) => {
  if (!date) return false
  return Date.now() - new Date(date).getTime() < EIGHT_WEEKS_MS
}

const isPriceSuspicious = (costPrice: number | null, price: number | null) => {
  if (costPrice == null || price == null || costPrice <= 0) {
    return false
  }

  return Math.abs(price - costPrice) / costPrice < 0.05
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (product: ProductWithCategories) => void
  onEdit: (product: ProductWithCategories) => void
  onDelete: (product: ProductWithCategories) => void
}): ColumnDef<ProductWithCategories>[] => [
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
      const enrichedFailedAt = product.enrichment_failed_at
      const isFreshEnrichment = isFresh(enrichedAt)

      if (enrichedFailedAt) {
        return (
          <Badge className="bg-red-200 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        )
      }

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
    id: "webhook_subscribed_status",
    header: "Webhook",
    cell: ({ row }) => {
      const subscribeStatus = row.original.webhook_subscribed_status

      if (subscribeStatus) {
        switch (subscribeStatus) {
          case "success":
            return (
              <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
                Subscribed
              </Badge>
            )
          case "recheck":
            return (
              <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-100">
                Need recheck
              </Badge>
            )
          case "failed":
            return (
              <Badge className="bg-red-200 text-red-800 hover:bg-red-100">
                Failed
              </Badge>
            )
          default:
            return (
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
                NULL
              </Badge>
            )
        }
      }
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
    cell: ({ row, getValue }) => {
      const costPrice = Number(getValue())
      const price = Number(row.original.price)

      const suspicious = isPriceSuspicious(costPrice, price)

      return (
        <span className={suspicious ? "text-yellow-600 font-semibold" : undefined}>
          <PriceRenderer value={costPrice} />
        </span>
      )
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row, getValue }) => {
      const price = Number(getValue())
      const costPrice = Number(row.original.cost_price)

      const suspicious = isPriceSuspicious(costPrice, price)

      return (
        <span className={suspicious ? "text-yellow-600 font-semibold" : undefined}>
          <PriceRenderer value={price} />
        </span>
      )
    }
  },
  {
    accessorKey: "ai_status",
    header: "AI Status",
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => {
      const categories: Category[] = row.original.categories

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[250px] truncate cursor-help">
                {categories.map((category) => category.name).join(" | ")}
              </div>
            </TooltipTrigger>

            <TooltipContent>
              <div className="max-w-[500px]">
                {categories.map((category) => category.full_path).join(" | ")}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
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
