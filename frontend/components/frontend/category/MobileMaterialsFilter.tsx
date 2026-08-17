"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { MaterialOption } from "@/types/material";
import { useTranslations } from "next-intl";

type MaterialsFilterProps = {
    activeMaterials: number[];
    materialsOptions: MaterialOption[];
    onChange: (next: number[]) => void;
};

export function MobileMaterialsFilter({
    activeMaterials,
    materialsOptions,
    onChange,
}: MaterialsFilterProps) {
    const t = useTranslations('frontend')
    const toggleMaterial = (materialId: number) => {
        const isSelected = activeMaterials.includes(materialId);

        const next = isSelected
            ? activeMaterials.filter((id) => id !== materialId)
            : [...activeMaterials, materialId];

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
                {materialsOptions.map((material) => {
                    const id = `material-${material.id}`;

                    return (
                        <div
                            key={material.id}
                            className="flex items-center space-x-2"
                            onClick={() => toggleMaterial(material.id)}
                            >
                            <Checkbox
                                id={id}
                                checked={activeMaterials.includes(material.id)}
                            />
                            <span className="cursor-pointer text-sm font-normal">
                                {material.translation?.name ?? material.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
