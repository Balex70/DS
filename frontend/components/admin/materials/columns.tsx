"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Material } from "@/types/material"

export const columns = (): ColumnDef<Material>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]
