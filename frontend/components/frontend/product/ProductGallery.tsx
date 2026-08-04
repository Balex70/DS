"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import ProductImage from "./ProductImage";
import { cn } from "@/lib/utils";
import { ProductImageType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    bigImage?: ProductImageType;
    images?: ProductImageType[];
    productName: string;
};

export default function ProductGallery({
    bigImage,
    images = [],
    productName,
}: Props) {
    const galleryImages = useMemo(() => {
        const result: ProductImageType[] = [];

        if (bigImage) {
            result.push(bigImage);
        }

        images.forEach((image) => {
            if (image.id !== bigImage?.id) {
                result.push(image);
            }
        });

        return result;
    }, [bigImage, images]);

    const [mainApi, setMainApi] = useState<CarouselApi>();
    const [activeIndex, setActiveIndex] = useState(0);
    const [thumbApi, setThumbApi] = useState<CarouselApi>();
    
    useEffect(() => {
        if (!mainApi || !thumbApi) return;

        const onSelect = () => {
            const index = mainApi.selectedScrollSnap();
            setActiveIndex(index);

            // IMPORTANT: force thumbnail into view
            thumbApi.scrollTo(index);
        };

        onSelect();
        mainApi.on("select", onSelect);
        mainApi.on("reInit", onSelect);

        return () => {
            mainApi.off("select", onSelect);
            mainApi.off("reInit", onSelect);
        };
    }, [mainApi, thumbApi]);

    if (!galleryImages.length) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                No image
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* MAIN CAROUSEL */}
            <Carousel
                key={bigImage?.id}
                setApi={setMainApi}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {galleryImages.map((image) => (
                        <CarouselItem key={image.id}>
                            <div className="flex justify-center">
                                <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-2xl border bg-muted">
                                    <ProductImage
                                        src={`/storage/${image.original_url}`}
                                        alt={productName}
                                        imageClassName="object-cover"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-4 size-10 [&>svg]:!size-6" />
                <CarouselNext className="right-4 size-10 [&>svg]:!size-6" />
            </Carousel>

            {/* THUMBNAILS */}
            <div className="relative w-full">
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => thumbApi?.scrollPrev()}
                    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => thumbApi?.scrollNext()}
                    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background shadow"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <Carousel
                    setApi={setThumbApi}
                    opts={{
                        align: "start",
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 px-10">
                        {galleryImages.map((image, index) => (
                            <CarouselItem
                                key={image.id}
                                className="basis-1/4 pl-2 md:basis-1/6 lg:basis-1/6"
                            >
                                <button
                                    type="button"
                                    onClick={() => mainApi?.scrollTo(index)}
                                    className={cn(
                                        "relative aspect-square w-full overflow-hidden rounded-xl border",
                                        activeIndex === index
                                            ? "border-black ring-black"
                                            : "border-muted"
                                    )}
                                >
                                    <ProductImage
                                        src={`/storage/${image.original_url}`}
                                        alt={productName}
                                        imageClassName="object-cover"
                                    />
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
}
