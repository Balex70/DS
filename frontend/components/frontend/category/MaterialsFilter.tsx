"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MaterialOption } from "@/types/material";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type MaterialsFilterProps = {
    activeMaterials: number[];
    materialsOptions: MaterialOption[];
    onChange: (next: number[]) => void;
};

export function MaterialsFilter({
    activeMaterials,
    materialsOptions,
    onChange,
}: MaterialsFilterProps) {
    const t = useTranslations('frontend')

    const groupedMaterials = useMemo(() => {
        const groups = new Map<
            string,
            { ids: number[]; name: string }
        >();

        for (const material of materialsOptions) {
            const key = material.name.trim().toLowerCase();
            const existing = groups.get(key);

            if (existing) {
                existing.ids.push(material.id);
            } else {
                const translatedName =
                    material.translation?.name ?? material.name;

                groups.set(key, {
                    ids: [material.id],
                    name:
                        translatedName.charAt(0).toUpperCase() +
                        translatedName.slice(1),
                });
            }
        }

        return Array.from(groups.values()).sort((a, b) =>
            a.name.localeCompare(b.name),
        );
    }, [materialsOptions]);

    const toggleMaterial = (materialIds: number[]) => {
        const isSelected = materialIds.some((id) =>
            activeMaterials.includes(id),
        );

        const next = isSelected
            ? activeMaterials.filter((id) => !materialIds.includes(id))
            : [...new Set([...activeMaterials, ...materialIds])];

        onChange(next);
    };

    return (
        <div className="space-y-4 pt-3 px-3">
            <div>
                <h3 className="text-sm font-medium">
                    {t('category.filter.material')}
                </h3>
            </div>

            <div className="space-y-2">
                {groupedMaterials.map((material) => {
                    const id = `material-${material.ids[0]}`;

                    return (
                        <div
                            key={material.name.toLowerCase()}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={id}
                                checked={material.ids.some((materialId) =>
                                    activeMaterials.includes(materialId),
                                )}
                                onCheckedChange={() =>
                                    toggleMaterial(material.ids)
                                }
                            />

                            <Label
                                htmlFor={id}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {material.name}
                            </Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
