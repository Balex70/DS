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

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    level: string | null
    realm: string | null
    onLevelChange: (value: string | null) => void
    onRealmChange: (value: string | null) => void
}

export function LogFilters({
    open,
    onOpenChange,
    level,
    realm,
    onLevelChange,
    onRealmChange,
}: Props) {
    type FilterBadge = {
        label: string
        onClick: () => void
        color: string
    }
    const activeFilters: { label: string; onClick: () => void; color: string }[] = [
        level && {
            label: "Level",
            onClick: () => onLevelChange(null),
            color: "blue",
        },
        realm && {
            label: "Realm",
            onClick: () => onRealmChange(null),
            color: "yellow",
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
                                    id="level"
                                    checked={level === "level"}
                                    onCheckedChange={(checked) =>
                                        onLevelChange(
                                            checked ? "level" : null
                                        )
                                    }
                                />
                                <Label htmlFor="level">
                                    Level
                                </Label>
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="realm"
                                    checked={realm === "realm"}
                                    onCheckedChange={(checked) =>
                                        onRealmChange(
                                            checked ? "realm" : null
                                        )
                                    }
                                />
                                <Label htmlFor="realm">
                                    Realm
                                </Label>
                            </Field>

                        </FieldGroup>

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
