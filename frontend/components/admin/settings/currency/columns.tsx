"use client"

import { Currency } from "@/types/currency"
import { ColumnDef } from "@tanstack/react-table"

export const columns = (): ColumnDef<Currency>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "from_currency",
    header: "From",
  },
  {
    accessorKey: "to_currency",
    header: "To",
  },
  {
    accessorKey: "rate",
    header: "Rate row",
  },
  {
    accessorKey: "rate",
    header: "Rate (Human friendly)",
    cell: ({ row }) => {
      const rate = Number(row.original.rate) / 1_000_000

      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 6,
      }).format(rate)
    },
  },
  {
    accessorKey: "rate_updated_at",
    header: "Updated at",
    cell: ({ row }) => {
      const date = row.original.rate_updated_at

      if (!date) {
        return "-"
      }

      return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(date))
    },
  },
]
