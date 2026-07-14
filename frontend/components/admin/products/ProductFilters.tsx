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

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    enriched: string | null
    aiTextsProcessed: string | null
    aiImagesProcessed: string | null
    categoryIds: number[];
    onEnrichedChange: (value: string | null) => void
    onAiTextsProcessedChange: (value: string | null) => void
    onAiImagesProcessedChange: (value: string | null) => void
    onCategoryIdsChange: (value: number[]) => void;
}

export function ProductFilters({
    open,
    onOpenChange,
    enriched,
    aiTextsProcessed,
    aiImagesProcessed,
    categoryIds,
    onEnrichedChange,
    onAiTextsProcessedChange,
    onAiImagesProcessedChange,
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
        enriched && {
            label: "Enriched",
            onClick: () => onEnrichedChange(null),
            color: "blue",
        },
        aiTextsProcessed && {
            label: "AI Texts",
            onClick: () => onAiTextsProcessedChange(null),
            color: "green",
        },
        aiImagesProcessed && {
            label: "AI Images",
            onClick: () => onAiImagesProcessedChange(null),
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
                        <FieldGroup className="space-y-3">

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

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="aiImagesProcessed"
                                    checked={aiImagesProcessed === "aiImagesProcessed"}
                                    onCheckedChange={(checked) =>
                                        onAiImagesProcessedChange(
                                            checked ? "aiImagesProcessed" : null
                                        )
                                    }
                                />
                                <Label htmlFor="aiImagesProcessed">
                                    AI Images
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
