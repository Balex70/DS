"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { ProductVariant } from "@/types/product"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = (): ColumnDef<ProductVariant>[] => [
  {
    accessorKey: "name_processed",
    header: "Name (Processed)",
    cell: ({ getValue }) => {
      const value = String(getValue())

      return (
        <div className="max-w-[450px] truncate">
          <span title={value}>{value}</span>
        </div>
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
    id: "ai_status",
    header: "AI Status",
    cell: ({ row }) => {
      const productVariant = row.original

      if (!productVariant.ai_status) {
        return (
          <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
            Null
          </Badge>
        )
      }

      return (
        <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
          {productVariant.ai_status}
        </Badge>
      )
    },
  },
]
