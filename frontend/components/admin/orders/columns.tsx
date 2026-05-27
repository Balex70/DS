"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types/order"
import { PriceRenderer } from "@/components/custom/PriceRenderer"

export const columns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "order_number",
    header: "Order Number",
  },
  {
    accessorKey: "customer_id",
    header: "Customer ID",
  },
  {
    accessorKey: "ds_order_id",
    header: "DS order ID",
  },
  {
    accessorKey: "ds_status",
    header: "DS Status",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
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
