"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "@/types/payment"
import { PriceRenderer } from "@/components/custom/PriceRenderer"

export const columns = (): ColumnDef<Payment>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "order_id",
    header: "Order ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "gateway",
    header: "Gateway",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue } ) => {
      const value = Number(getValue())

      return (
        <PriceRenderer value={value} />
      )
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
]
