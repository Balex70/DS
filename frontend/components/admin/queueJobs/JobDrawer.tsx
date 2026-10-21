"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CardContent } from "@/components/ui/card"
import { Job } from "@/types/job"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { format } from "date-fns"

export function JobDrawer({
  open,
  onOpenChange,
  job
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  job: Job | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ maxWidth: '40vw' }}>
        <SheetHeader>
          <SheetTitle>Job details (ID: {job ? job.id : ''})</SheetTitle>
        </SheetHeader>

        {job && (
            <CardContent className="space-y-4">
                <FieldGroup className="grid grid-cols-2">
                    <Field>
                        <FieldLabel>ID</FieldLabel>
                        <span className="text-md text-muted-foreground">
                            {job.id}
                        </span>
                    </Field>
                    <Field>
                        <FieldLabel>Queue</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {job.queue}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Payload</FieldLabel>
                        <div className="h-[15vh] resize-y overflow-auto overflow-auto rounded-lg border bg-muted/30 p-4">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                {JSON.stringify(job.payload, null, 2)}
                            </pre>
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Attempts</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {job.attempts}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Reserved at</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {job.reserved_at ? format(new Date(job.reserved_at), "PPpp") : "No"}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Available at</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {job.available_at ? format(new Date(job.available_at), "PPpp") : "No"}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel>Created at</FieldLabel>
                        <div className="text-md text-muted-foreground">
                            {job.created_at ? format(new Date(job.created_at), "PPpp") : "No"}
                        </div>
                    </Field>
                </FieldGroup>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>
  )
}
