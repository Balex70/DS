import { useTranslations } from "next-intl";
import { getCountryCarriers, Carrier } from "./carriers";

function CarrierBadge({ carrier }: {carrier: Carrier}) {
    const hasLabel = !!carrier.name;

    return (
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={carrier.logo}
                alt={carrier.name ?? carrier.id}
                className="h-6 w-auto object-contain"
                />

            {hasLabel && <span>{carrier.name}</span>}
        </div>
    );
}

export function FinalCarriers({ country }: {country?: string}) {
    const carriers = getCountryCarriers(country);
    const t = useTranslations('frontend')
    if (!carriers.length) {
        return null;
    }

    return (
        <div className="mt-3 space-y-2">
            <div className="text-xs text-muted-foreground">
                {t('checkout.delivered_by_logistics_partners')}
            </div>

            <div className="flex flex-wrap gap-2">
                {carriers.map(carrier => (
                    <CarrierBadge
                        key={carrier.id}
                        carrier={carrier}
                    />
                ))}
            </div>
        </div>
    );
}
