'use client'

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { LevelMultiSelect } from "./LevelMultiSelect"
import { RealmMultiSelect } from "./RealmMultiSelect"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    levels: string[]
    realms: string[]
    onLevelsChange: (value: string[]) => void
    onRealmsChange: (value: string[]) => void
}

export function LogFilters({
    open,
    onOpenChange,
    levels,
    realms,
    onLevelsChange,
    onRealmsChange,
}: Props) {
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
                                <LevelMultiSelect
                                    value={levels}
                                    onChange={onLevelsChange}
                                    />
                            </Field>

                            <Field orientation="horizontal">
                                <RealmMultiSelect
                                    value={realms}
                                    onChange={onRealmsChange}
                                    />
                            </Field>

                        </FieldGroup>

                    </div>
                </CardContent>
            </Card>
            </CollapsibleContent>
        </Collapsible>
        </div>
    )
}
