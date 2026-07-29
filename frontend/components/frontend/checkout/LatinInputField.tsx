import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { LatinFieldType, OrderPayload } from "@/types/order";

interface LatinFieldProps {
    form: OrderPayload;
    fieldName: LatinFieldType;
    initialValue: string;
    onSave: <K extends LatinFieldType>(field: K, value: OrderPayload[K]) => void;
}

export function LatinInputField({ form, fieldName, initialValue, onSave }: LatinFieldProps) {
    const [ editField, setEditField] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            {
                editField ? (
                    <div className="relative flex-1">
                        <Input
                            ref={inputRef}
                            className="h-9 text-sm text-muted-foreground"
                            defaultValue={initialValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onSave(fieldName, e.currentTarget.value);
                                    setEditField(false);
                                }
                            }}
                        />
                        <Button
                            type="button"
                            size="sm"
                            className="absolute right-1 top-1/2 h-7 h-full -translate-y-1/2 bg-emerald-600 px-3 text-white hover:bg-emerald-700"
                            onClick={() => {
                                if (inputRef.current) {
                                    onSave(fieldName, inputRef.current.value);
                                }
                                setEditField(false);
                            }}
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between text-xs text-muted-foreground ml-2">
                        <span
                            onClick={() => setEditField(true)}
                            >
                            <span>Latin:</span> {form[fieldName]}
                        </span>

                        <Button
                            key="done"
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 py-0 text-xs"
                            onClick={() => setEditField(true)}
                        >
                            <Pencil className="!h-3 !w-3" />
                            Edit
                        </Button>
                    </div>
                )
            }
        </div>
    );
}
