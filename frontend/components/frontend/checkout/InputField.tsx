import { Input } from "@/components/ui/input";
import { LatinFieldType, OrderPayload } from "@/types/order";
import { checkoutSchemaValidation, CheckoutValidationType } from "@/helpers/validators/checkout-schema-validation";
import { z } from "zod";
import { FieldLabel } from "@/components/ui/field";
import { LatinInputField } from "./LatinInputField";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface FieldProps {
    form: OrderPayload;
    label: string;
    fieldName: keyof OrderPayload;
    latinFieldName?: LatinFieldType;
    onFieldChange: <K extends keyof OrderPayload>(field: K, value: OrderPayload[K]) => void;
    onLatinFieldChange: <K extends LatinFieldType>(field: K, value: OrderPayload[K]) => void;
    errors: Record<string, string[]>
}

export function InputField({
    form,
    label,
    fieldName,
    latinFieldName,
    onFieldChange,
    onLatinFieldChange,
    errors
}: FieldProps) {
    const t = useTranslations('frontend')
    const schema = useMemo(
        () => checkoutSchemaValidation(t),
        [t]
    );
    const feValidationResult = schema.safeParse(form);
    const feErrors = feValidationResult.success
        ? {}
        : z.flattenError(feValidationResult.error).fieldErrors;
    const getFieldError = (field: keyof OrderPayload) => feErrors[field as keyof CheckoutValidationType]?.[0] ?? errors[field]?.[0];

    return (
        <div className="space-y-1">
            <FieldLabel className="text-sm text-muted-foreground font-medium">{label}:</FieldLabel>
            <Input
                placeholder=""
                value={form[fieldName] ?? ""}
                onChange={(e) => onFieldChange(fieldName, e.target.value)}
                className="
                    h-12
                    !text-base
                    rounded-lg
                    border-muted-foreground/25
                    transition-colors
                    focus-visible:border-green-600
                    focus-visible:ring-2
                    focus-visible:ring-green-600/20
                    focus-visible:ring-offset-0
                "
            />
            {((form[fieldName]) && latinFieldName) &&
                (
                    <LatinInputField
                        form={form}
                        label={label}
                        fieldName={latinFieldName}
                        initialValue={form[latinFieldName] ?? ""}
                        onSave={onLatinFieldChange}
                    />
                )
            }
            {getFieldError(fieldName) ? (
                <p className="text-sm text-red-500">
                    {getFieldError(fieldName)}
                </p>
            ) : (
                (latinFieldName && getFieldError(latinFieldName)) && (
                    <p className="text-sm text-red-500">
                        {getFieldError(latinFieldName)}
                    </p>
                )
            )}
            
        </div>
    );
}
