"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { OrderItem } from "@/types/order"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = (): ColumnDef<OrderItem>[] => [
  {
    accessorKey: "product_variant_id",
    header: "Variant ID",
  },
  {
    accessorKey: "title",
    header: "Title",
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
    accessorKey: "quantity",
    header: "Qty",
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
    accessorKey: "total",
    header: "Total",
    cell: ({ getValue }) => {
      const value = Number(getValue())

      return (
        <PriceRenderer value={value} />
      )
    }
  },
]
