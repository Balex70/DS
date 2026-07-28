import { z } from "zod";

export const checkoutSchemaValidation = z.object({
    shipping_full_name: z
        .string()
        .trim()
        .min(1, "Full name is required"),

    shipping_phone: z
        .string()
        .trim()
        .min(1, "Phone number is required")
        .min(6, "Phone number is too short")
        .max(20, "Phone number is too long")
        .refine(
            (value) => /^[+\d\s()-]{6,20}$/.test(value),
            "Invalid phone number"
        ),

    shipping_email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email"),

    shipping_address_line1: z
        .string()
        .trim()
        .min(1, "Address is required"),

    shipping_city: z
        .string()
        .trim()
        .min(1, "City is required"),

    shipping_country: z
        .string()
        .length(2, "Country is required"),
});

export type CheckoutValidationType = z.infer<typeof checkoutSchemaValidation>;
