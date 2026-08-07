"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Order } from "@/types/order"
import { PriceRenderer } from "@/components/custom/PriceRenderer"
import { CircleAlert } from "lucide-react"

export const columns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
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
    accessorKey: "is_sandbox",
    header: "Sandbox",
    cell: ({ getValue }) => {
      const value = getValue()

      return (
        value === true ? <CircleAlert className="text-yellow-500" /> : null
      )
    }
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
    accessorKey: "ds_status",
    header: "DS Status",
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
