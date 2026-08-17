import { z } from "zod";

export const checkoutSchemaValidation = (
    t: (key: string) => string
) => z.object({
    shipping_full_name: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.full_name_required")),

    shipping_full_name_latin: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.full_name_latin_required")),

    shipping_phone: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.phone_required"))
        .min(6, t("checkout.shipping_info.validation.phone_too_short"))
        .max(20, t("checkout.shipping_info.validation.phone_too_long"))
        .refine(
            (value) => /^[+\d\s()-]{6,20}$/.test(value),
            t("checkout.shipping_info.validation.phone_invalid")
        ),

    shipping_email: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.email_required"))
        .email(t("checkout.shipping_info.validation.email_invalid")),

    shipping_address_line1: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.address_line_1_required")),

    shipping_address_line1_latin: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.address_line_1_latin_required")),

    shipping_city: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.city_required")),

    shipping_city_latin: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.city_latin_required")),

    shipping_postal_code: z
        .string()
        .trim()
        .min(1, t("checkout.shipping_info.validation.postal_code_required")),

    shipping_country: z
        .string()
        .length(2, t("checkout.shipping_info.validation.country_required")),
});

export type CheckoutValidationType = z.infer<typeof checkoutSchemaValidation>;
