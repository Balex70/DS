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
import { useAdminCategories } from "@/hooks/use-admin-categories";
import { CategoryMultiSelect } from "./CategoryMultiSelect";
import { EnrichStatusesMultiSelect } from "./EnrichStatusesMultiSelect"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    enrichStatuses: string[]
    aiTextsProcessed: string | null
    categoryIds: number[];
    onEnrichStatusesChange: (value: string[]) => void
    onAiTextsProcessedChange: (value: string | null) => void
    onCategoryIdsChange: (value: number[]) => void;
}

export function ProductFilters({
    open,
    onOpenChange,
    enrichStatuses,
    aiTextsProcessed,
    categoryIds,
    onEnrichStatusesChange,
    onAiTextsProcessedChange,
    onCategoryIdsChange,
}: Props) {
    const { categories } = useAdminCategories();
    const categoryOptions = categories;

    type FilterBadge = {
        label: string
        onClick: () => void
        color: string
    }
    const activeFilters: { label: string; onClick: () => void; color: string }[] = [
        aiTextsProcessed && {
            label: "AI Texts",
            onClick: () => onAiTextsProcessedChange(null),
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
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT COLUMN */}
                        <FieldGroup className="space-y-2 gap-0">

                            <Label>Enrich</Label>
                            <Field orientation="horizontal">
                                <EnrichStatusesMultiSelect
                                    value={enrichStatuses}
                                    onChange={onEnrichStatusesChange}
                                    />
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="aiTextsProcessed"
                                    checked={aiTextsProcessed === "aiTextsProcessed"}
                                    onCheckedChange={(checked) =>
                                        onAiTextsProcessedChange(
                                            checked ? "aiTextsProcessed" : null
                                        )
                                    }
                                />
                                <Label htmlFor="aiTextsProcessed">
                                    AI Texts
                                </Label>
                            </Field>

                        </FieldGroup>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-2">
                            <Label>Categories</Label>

                            <CategoryMultiSelect
                                options={categoryOptions}
                                value={categoryIds}
                                onChange={onCategoryIdsChange}
                            />
                        </div>

                    </div>
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
