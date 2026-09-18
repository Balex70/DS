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
import { Log } from "@/types/log"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns = ({
  onView,
  onDelete,
}: {
  onView: (log: Log) => void
  onDelete: (log: Log) => void
}): ColumnDef<Log>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "level",
    header: "Level",
    cell: ({ row }) => {
      const log = row.original
      switch (log.level) {
        case "info":
          return (
            <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-100">
              INFO
            </Badge>
          )
        case "success":
          return (
            <Badge className="bg-green-200 text-green-800 hover:bg-green-100">
              SUCCESS
            </Badge>
          )
        case "warning":
          return (
            <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-100">
              WARNING
            </Badge>
          )
        case "error":
          return (
            <Badge className="bg-red-200 text-red-800 hover:bg-red-100">
              ERROR
            </Badge>
        )
        default:
          return (
            <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
              UNKNOWN
            </Badge>
          )
      }
    },
  },
  {
    id: "realm",
    header: "AI Texts",
    cell: ({ row }) => {
      const log = row.original

      if (log.realm) {
        return (
          <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-100">
            {log.realm}
          </Badge>
        )
      }
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ getValue }) => {
      const value = String(getValue())

      return (
        <div className=" max-w-[1050px] truncate">
          <span title={value}>{value}</span>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original

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
                onClick={() => navigator.clipboard.writeText(log.message)}
              >
                Copy message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(log)}>
                View log
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(log)}>
                Delete log
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
