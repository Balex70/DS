"use client";

import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useLatestProducts } from "@/hooks/use-latest-products";
import { useLocale } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import HeroCarouselImage from "@/components/custom/HeroCarouselImage";

export function HeroCarousel() {
    const locale = useLocale();
    const { currency } = useCurrency();
    const { data: products } = useLatestProducts({locale, currency});
    
    return (
        <Carousel
            opts={{
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 4000,
                    stopOnInteraction: false,
                }),
            ]}
            className="w-full mb-8"
        >
            <CarouselContent>
                {products && products.map((product) => {
                    const cheapestVariantImage = product.cheapest_variant?.image?.original_url ?? product.big_image?.original_url ?? undefined;
                    return (
                        <CarouselItem key={product.id}>
                            <Link
                                href={`/product/${product.id}`}
                                className="group block"
                            >
                                <div className="h-[420px] overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                                    <div className="grid h-full grid-cols-2">
                                        {/* Left side */}
                                        <div className="flex flex-col justify-center px-12 text-white">
                                            <p className="mb-2 text-sm uppercase tracking-widest text-white">
                                                New Arrival
                                            </p>

                                            <h2 className="mb-6 line-clamp-2 text-5xl font-bold">
                                                {product.translation?.name ??
                                                    product.name_processed ??
                                                    product.name_raw}
                                            </h2>

                                            <div className="mb-8 flex items-center gap-3">
                                                <PriceRenderer
                                                    value={product.price}
                                                    className="text-3xl font-semibold"
                                                />

                                                {currency !== "USD" && product.currency_price && (
                                                    <span className="text-base text-slate-300">
                                                        (
                                                        <PriceRenderer
                                                            value={product.currency_price}
                                                            currency={currency}
                                                        />
                                                        )
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                {/* <Button asChild size="lg">
                                                    <Link href={`/product/${product.id}`}>
                                                        Shop now
                                                    </Link>
                                                </Button> */}
                                            </div>
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center justify-center overflow-hidden m-2">
                                            <HeroCarouselImage
                                                src={`/storage/${cheapestVariantImage}`}
                                                alt={product.name_processed ?? product.name_raw}
                                                width={600}
                                                height={600}
                                                className="
                                                    max-h-[100%]
                                                    max-w-[100%]
                                                    rounded-xl
                                                    border-3
                                                    border-sky-100
                                                    object-contain
                                                    bg-white
                                                "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    )
                })}
            </CarouselContent>

            <CarouselPrevious className="left-6" />
            <CarouselNext className="right-6" />
        </Carousel>
    );
}
