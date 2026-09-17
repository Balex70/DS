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
                        <FieldLabel>Description Processed</FieldLabel>
                        <span className="text-md text-muted-foreground">
                            {log.id}
                        </span>
                    </Field>
                    <Field>
                        <FieldLabel>Level</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {log.level}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Price</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {log.realm}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Message</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {log.message}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Suggested Price</FieldLabel>
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
