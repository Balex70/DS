"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Log } from "@/types/log"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const LevelBadge = ({ level }: { level: string }) => {
    switch (level) {
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
}

export function LogDrawer({
  open,
  onOpenChange,
  log
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  log: Log | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '40vw' }}>
        <SheetHeader>
          <SheetTitle>Log details (ID: {log ? log.id : ''})</SheetTitle>
        </SheetHeader>

        {log && (
            <CardContent className="space-y-4">
                <FieldGroup className="grid grid-cols-2">
                    <Field>
                        <FieldLabel>ID</FieldLabel>
                        <span className="text-md text-muted-foreground">
                            {log.id}
                        </span>
                    </Field>
                    <Field>
                        <FieldLabel>Level</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            <LevelBadge level={log.level} />
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Realm</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {log.realm}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Message</FieldLabel>
                        <div className="max-h-120 overflow-y-auto whitespace-pre-wrap text-md text-muted-foreground">
                            {log.message}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Created At</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {log.created_at ? format(new Date(log.created_at), "PPpp") : "No"}
                        </div>
                    </Field>
                </FieldGroup>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
