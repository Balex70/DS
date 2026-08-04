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
                                <div
                                    className="
                                        h-[420px]
                                        xs:h-[440px]
                                        sm:h-[480px]
                                        md:h-[420px]
                                        overflow-hidden
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-slate-900
                                        via-slate-800
                                        to-slate-700
                                    "
                                >
                                    <div className="grid h-full grid-cols-1 md:grid-cols-2">
                                        {/* Left side */}
                                        <div className="
                                            min-h-0
                                            flex
                                            flex-col
                                            justify-center
                                            pt-4
                                            pb-2
                                            px-6
                                            sm:px-6
                                            md:px-10
                                            text-white">
                                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white sm:text-sm">
                                                New Arrival
                                            </p>

                                            <h2 className="
                                                mb-1
                                                line-clamp-2
                                                text-2xl
                                                font-bold
                                                sm:text-3xl
                                                sm:mb-2
                                                md:mb-6
                                                md:text-4xl
                                                lg:text-5xl">
                                                {product.translation?.name ??
                                                    product.name_processed ??
                                                    product.name_raw}
                                            </h2>

                                            <div className="mb-0 flex items-center gap-2 sm:gap-3 sm:mb-2 md:mb-8">
                                                <PriceRenderer
                                                    value={product.price}
                                                    className="text-3xl font-semibold"
                                                />

                                                {currency !== "USD" && product.currency_price && (
                                                    <span className="text-sm text-slate-300 md:text-base">
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
                                        <div className="
                                            min-h-0
                                            relative
                                            flex
                                            items-center
                                            justify-center
                                            py-0
                                            px-2
                                            md:p-2
                                            lg:p-4
                                            ">
                                            <HeroCarouselImage
                                                src={`/storage/${cheapestVariantImage}`}
                                                alt={product.name_processed ?? product.name_raw}
                                                width={600}
                                                height={600}
                                                className="
                                                    h-auto
                                                    max-h-[95%]
                                                    max-w-full
                                                    object-contain
                                                    rounded-xl
                                                    border-4
                                                    border-sky-100
                                                    bg-white
                                                    p-0
                                                    sm:max-h-[90%]
                                                    md:max-h-[90%]
                                                    lg:max-h-[98%]
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

            <CarouselPrevious className="-left-5 lg:left-2" />
            <CarouselNext className="-right-5 lg:right-2" />
        </Carousel>
    );
}
