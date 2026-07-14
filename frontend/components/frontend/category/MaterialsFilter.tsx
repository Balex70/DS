"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MaterialOption } from "@/types/material";

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
                    Materials
                </h3>
            </div>

            <div className="space-y-2">
                {materialsOptions.map((material) => {
                    const id = `material-${material.id}`;

                    return (
                        <div key={material.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={id}
                                checked={activeMaterials.includes(material.id)}
                                onCheckedChange={() => toggleMaterial(material.id)}
                            />
                            <Label
                                htmlFor={id}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {material.translation?.name ?? material.name}
                            </Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
