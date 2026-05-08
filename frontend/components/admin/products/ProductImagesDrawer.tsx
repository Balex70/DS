"use client"

import NextImageWithReplace from "@/components/custom/NextImageWithReplace"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product } from "@/types/product"

export function ProductImagesDrawer({
  product,
}: {
  product: Product | null
}) {
  return (
    <>
      {product && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT: BIG IMAGE */}
            <div className="max-w-64">
              {product.big_image && (
                <>
                  <Label className="mb-2">
                    Product image {!product.last_enrichment_at && <span>(image from CJ)</span>}
                  </Label>
                  <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                    {product.big_image?.ai_url ? (
                      <NextImageWithReplace
                        src={product.big_image.ai_url}
                        alt={product.name_raw}
                        width={200}
                        height={200}
                        imageClassName="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={product.big_image.original_url}
                        alt={product.name_raw}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT: TABS */}
            {product.images?.length > 0 && (
              <div className="w-full max-w-52">
                <Tabs defaultValue="original">

                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Other</TabsTrigger>
                    <TabsTrigger value="ai">AI</TabsTrigger>
                  </TabsList>

                  {/* ORIGINAL IMAGES */}
                  <TabsContent value="original">
                    <Carousel className="w-full sm:max-w-xs mt-2">
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
                  </TabsContent>

                  {/* AI IMAGES */}
                  <TabsContent value="ai">
                    <Carousel className="w-full sm:max-w-xs mt-2">
                      <CarouselContent>
                        {product.images.filter(img => img.ai_url).map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-2">
                                  <NextImageWithReplace
                                    src={img.ai_url}
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
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </>
  )
}
