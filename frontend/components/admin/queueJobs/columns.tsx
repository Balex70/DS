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
import { Job } from "@/types/job"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  onView,
  onDelete,
}: {
  onView: (job: Job) => void
  onDelete: (job: Job) => void
}): ColumnDef<Job>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "queue",
    header: "Queue",
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
    accessorKey: "attempts",
    header: "Attempts",
  },
  {
    accessorKey: "reserved_at",
    header: "Reserved at",
    cell: ({ getValue }) => {
      const value = getValue<string>()

      if (!value) {
        return null
      }
      return new Date(value).toLocaleString()
    },
  },
  {
    accessorKey: "available_at",
    header: "Available at",
    cell: ({ getValue }) => {
      const value = getValue<string>()

      if (!value) {
        return null
      }
      return new Date(value).toLocaleString()
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
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
      const job = row.original

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
                onClick={() => navigator.clipboard.writeText(job.payload)}
              >
                Copy payload
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(job)}>
                View job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(job)}>
                Delete job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
