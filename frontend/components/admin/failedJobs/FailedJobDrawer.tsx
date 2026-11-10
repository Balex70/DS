"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { FailedJob } from "@/types/failedJob"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { format } from "date-fns"

export function FailedJobDrawer({
  open,
  onOpenChange,
  failedJob
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  failedJob: FailedJob | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '40vw' }}>
        <SheetHeader>
          <SheetTitle>Failed Job details (ID: {failedJob ? failedJob.id : ''})</SheetTitle>
        </SheetHeader>

        {failedJob && (
            <CardContent className="space-y-4">
                <FieldGroup className="grid grid-cols-2">
                    <Field>
                        <FieldLabel>ID</FieldLabel>
                        <span className="text-md text-muted-foreground">
                            {failedJob.id}
                        </span>
                    </Field>
                    <Field>
                        <FieldLabel>Queue</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {failedJob.queue}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Payload</FieldLabel>
                        <div className="h-[35vh] resize-y overflow-auto overflow-auto rounded-lg border bg-muted/30 p-4">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                {JSON.stringify(failedJob.payload, null, 2)}
                            </pre>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Exception</FieldLabel>
                        <div className="h-[35vh] resize-y overflow-auto overflow-auto rounded-lg border bg-muted/30 p-4">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                {JSON.stringify(failedJob.exception, null, 2)}
                            </pre>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Failed at</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {failedJob.failed_at ? format(new Date(failedJob.failed_at), "PPpp") : "No"}
                        </div>
                    </Field>
                </FieldGroup>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
