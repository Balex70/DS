'use client'

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup } from "@/components/ui/field"
import { BadgeX } from "lucide-react"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    enriched: string | null
    aiProcessed: string | null
    onEnrichedChange: (value: string | null) => void
    onAiProcessedChange: (value: string | null) => void
}

export function ProductFilters({
    open,
    onOpenChange,
    enriched,
    aiProcessed,
    onEnrichedChange,
    onAiProcessedChange,
}: Props) {
    type FilterBadge = {
        label: string
        onClick: () => void
        color: string
    }
    const activeFilters: { label: string; onClick: () => void; color: string }[] = [
        enriched && {
            label: "Enriched",
            onClick: () => onEnrichedChange(null),
            color: "blue",
        },
        aiProcessed && {
            label: "AI Processed",
            onClick: () => onAiProcessedChange(null),
            color: "green",
        },
    ].filter((f): f is FilterBadge => f !== null)
    return (
        <div className="w-full mb-4">
        <Collapsible open={open} onOpenChange={onOpenChange}>
            <CollapsibleTrigger asChild>
            <Button variant="outline" size="default">
                Filters
            </Button>
            
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
            <Card className="w-full">
                <CardContent className="p-4 flex gap-6">
                <FieldGroup className="space-y-3 pt-2">

                    <Field orientation="horizontal">
                    <Checkbox
                        id="enriched"
                        checked={enriched === "enriched"}
                        onCheckedChange={(checked) =>
                        onEnrichedChange(
                            checked ? "enriched" : null
                        )
                        }
                    />
                    <Label htmlFor="enriched">
                        Enriched
                    </Label>
                    </Field>

                    <Field orientation="horizontal">
                    <Checkbox
                        id="aiProcessed"
                        checked={aiProcessed === "aiProcessed"}
                        onCheckedChange={(checked) =>
                        onAiProcessedChange(
                            checked ? "aiProcessed" : null
                        )
                        }
                    />
                    <Label htmlFor="aiProcessed">
                        AI Processed
                    </Label>
                    </Field>

                </FieldGroup>
                </CardContent>
            </Card>
            </CollapsibleContent>
            {activeFilters.length > 0 && (
                <div className="flex w-full flex-wrap justify-center gap-2 mt-3">
                {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="default" onClick={filter.onClick}>
                        {filter.label}
                        <BadgeX data-icon="inline-start" />
                    </Badge>
                ))}
                </div>
            )}
        </Collapsible>
        </div>
    )
}
