import Image from "next/image";
import { getCountryCarriers, Carrier } from "./carriers";

function CarrierBadge({ carrier }: {carrier: Carrier}) {
    const hasLabel = !!carrier.name;

    return (
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs">
            <Image
                src={carrier.logo}
                alt={carrier.name ?? carrier.id}
                width={hasLabel ? 18 : 80}
                height={hasLabel ? 18 : 32}
            />

            {hasLabel && <span>{carrier.name}</span>}
        </div>
    );
}

export function FinalCarriers({ country }: {country?: string}) {
    const carriers = getCountryCarriers(country);

    if (!carriers.length) {
        return null;
    }

    return (
        <div className="mt-3 space-y-2">
            <div className="text-xs text-muted-foreground">
                Delivered by one of our local logistics partners
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
