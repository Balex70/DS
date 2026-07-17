"use client";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Card } from "@/components/ui/card";
import { PriceRenderer } from "@/components/custom/PriceRenderer";
import { useCurrency } from "@/context/CurrencyContext";

type DropdownSearchResultsProps = {
    products?: Product[];
    categories?: Category[];
    onSelectProduct: (product: Product) => void;
    onSelectCategory: (category: Category) => void;
}

export function DropdownSearchResults({
    products = [],
    categories = [],
    onSelectProduct,
    onSelectCategory,
}: DropdownSearchResultsProps) {
    const { currency } = useCurrency();
    const hasResults =
        products.length > 0 || categories.length > 0;

    if (!hasResults) {
        return (
            <Card className="mt-0 p-3 text-sm text-muted-foreground">
                No results found
            </Card>
        );
    }

    return (
        <Card className="mt-0 p-2 space-y-3 rounded-md">
            {/* Products */}
            {products.length > 0 && (
                <div>
                    <div className="px-2 text-xs font-medium text-muted-foreground mb-1">
                        Products
                    </div>

                    <div className="space-y-1">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() =>
                                    onSelectProduct(product)
                                }
                                className="w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-muted flex justify-between"
                            >
                                <span className="truncate">{product.name_processed ?? product.name_raw}</span>

                                {product.price && (
                                    <span className="text-xs text-muted-foreground">
                                        <PriceRenderer value={product.price} />
                                        {(currency !== "USD" && product.currency_price) && (
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                                                (
                                                <PriceRenderer
                                                    value={product.currency_price}
                                                    currency={currency}
                                                />
                                                )
                                            </span>
                                        )}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                    <div className="px-2 text-xs font-medium text-muted-foreground mb-1">
                        Categories
                    </div>

                    <div className="space-y-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() =>
                                    onSelectCategory(category)
                                }
                                className="w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-muted"
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
