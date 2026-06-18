import { getMaxDays } from "@/helpers/shipping";
import { ShippingMethod } from "@/types/shipping";

export type ShippingTier = "long" | "standard" | "express";
export function getShippingTier(method: { estimated_delivery?: string | null }): ShippingTier {
    if (!method.estimated_delivery) {
        return "standard";
    }

    const days = getMaxDays(method.estimated_delivery);

    if (days <= 7) return "express";
    if (days <= 14) return "standard";
    return "long";
}

export const SHIPPING_TIER_META: Record<
    ShippingTier,
    {
        label: string;
        color: string;
    }
> = {
    express: {
        label: "Express",
        color: "text-red-500",
    },
    standard: {
        label: "Standard",
        color: "text-gray-600",
    },
    long: {
        label: "Long Delivery",
        color: "text-yellow-700",
    },
};

const KNOWN_CARRIERS = [
    "DHL",
    "USPS",
    "UPS",
    "FedEx",
    "Royal Mail",
    "Canada Post",
    "Australia Post",
    "PostNL",
    "La Poste",
    "Correos",
    "GLS",
    "DPD",
    "Hermes",
    "Evri",
    "YunExpress",
    "Yanwen",
    "4PX",
    "SF Express",
    "EMS",
] as const;

export function getCarrierFromMethodName(name: string): string | null {
    const lower = name.toLowerCase();

    const carrier = KNOWN_CARRIERS.find((carrier) =>
        lower.includes(carrier.toLowerCase())
    );

    return carrier ?? null;
}

export function ShippingTierBadge({method}: {method: ShippingMethod}) {
    const tier = getShippingTier(method);   
    const meta = SHIPPING_TIER_META[tier];
    const carrier = getCarrierFromMethodName(method.name);

    return (
        <div className="flex items-center gap-1">
            <span className={`font-medium ${meta.color}`}>
                {meta.label}
            </span>

            {carrier && (
                <span className="font-medium text-muted-foreground">
                    ({carrier})
                </span>
            )}
        </div>
    );
}
