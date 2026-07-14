"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { ProductVariant } from "@/types/product"

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
    accessorKey: "ai_status",
    header: "AI Status",
  },
]
