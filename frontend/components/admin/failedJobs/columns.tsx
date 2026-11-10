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
import { MoreHorizontal } from "lucide-react"
import { FailedJob } from "@/types/failedJob"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  onView,
  onDelete,
}: {
  onView: (failedJob: FailedJob) => void
  onDelete: (failedJob: FailedJob) => void
}): ColumnDef<FailedJob>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "failed",
    header: "Failed",
  },
  {
    accessorKey: "payload",
    header: "Payload",
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
    accessorKey: "exception",
    header: "Exception",
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
    accessorKey: "failed_at",
    header: "Failed at",
    cell: ({ getValue }) => {
      const value = getValue<string>()

      if (!value) {
        return null
      }
      return new Date(value).toLocaleString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const failedJob = row.original

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
                onClick={() => navigator.clipboard.writeText(failedJob.payload)}
              >
                Copy payload
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(failedJob)}>
                View job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(failedJob)}>
                Delete job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
