"use client"

import NextImageWithReplace from "@/components/custom/NextImageWithReplace"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { Product } from "@/types/product"

export function ProductImagesDrawer({
  product,
}: {
  product: Product | null
}) {
  return (
    <>
        {product && (
            <CardContent className="space-y-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* LEFT: BIG IMAGE */}
                    <div className="max-w-64">
                    {product.big_image && (
                        <>
                            <Label className="mb-2">Product image {!product.last_enrichment_at && <h4>(image from CJ)</h4>}</Label>
                            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                                {product.last_enrichment_at ? (<NextImageWithReplace
                                    src={product.big_image}
                                    alt={product.name_raw}
                                    width={200}
                                    height={200}
                                    imageClassName="h-full w-full object-cover"
                                />) : (
                                    <img
                                        src={product.big_image}
                                        alt={product.name_raw}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </>
                    )}
                    </div>

                    {/* RIGHT: GALLERY */}
                    {product.images?.length > 0 && (
                    <div className="w-full max-w-52">
                        <Label className="mb-2">Other images</Label>
                        <Carousel className="w-full sm:max-w-xs">
                        <CarouselContent>
                            {product.images.map((img, idx) => (
                            <CarouselItem key={idx}>
                                <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-2">
                                    <NextImageWithReplace
                                        src={img.original_url}
                                        alt={idx.toString()}
                                        width={200}
                                        height={200}
                                        imageClassName="h-full w-full object-cover"
                                    />
                                    </CardContent>
                                </Card>
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                        </Carousel>
                    </div>
                    )}
                </div>
                </CardContent>
        )}
    </>
  )
}
