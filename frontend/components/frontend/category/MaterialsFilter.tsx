"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type MaterialsFilterProps = {
    activeMaterials: string[];
    materialsOptions: string[];
    onChange: (next: string[]) => void;
};

export function MaterialsFilter({
    activeMaterials,
    materialsOptions,
    onChange,
}: MaterialsFilterProps) {
    const toggleMaterial = (material: string) => {
        const isSelected = activeMaterials.includes(material);

        const next = isSelected
            ? activeMaterials.filter((m) => m !== material)
            : [...activeMaterials, material];

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
                    const id = `material-${material}`;

                    return (
                        <div key={material} className="flex items-center space-x-2">
                            <Checkbox
                                id={id}
                                checked={activeMaterials.includes(material)}
                                onCheckedChange={() => toggleMaterial(material)}
                            />
                            <Label
                                htmlFor={id}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {material}
                            </Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
