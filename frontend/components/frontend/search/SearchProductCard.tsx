import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import Link from "next/link";

interface SearchProductCardProps {
    product: Product;
}

export function SearchProductCard({
    product,
}: SearchProductCardProps) {
    return (
        <Link href={`/product/${product.id}`}>
            <Card className="h-full transition hover:shadow-md">
                <CardContent className="space-y-2 p-4">
                    <div className="font-medium line-clamp-2">
                        {product.name_processed ?? product.name_raw}
                    </div>

                    <div className="text-sm text-muted-foreground">
                        ${product.price}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
