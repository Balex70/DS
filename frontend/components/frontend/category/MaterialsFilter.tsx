"use client";

type MaterialsFilterProps = {
    value: string[];
};

export function MaterialsFilter({
    value,
}: MaterialsFilterProps) {
    return (
        <div className="space-y-4 pt-2 px-3">
            <div>
                <h3 className="text-sm font-medium">
                    Materials
                </h3>
            </div>

            <div className="flex items-center gap-2">
                {value}
            </div>
        </div>
    );
}
